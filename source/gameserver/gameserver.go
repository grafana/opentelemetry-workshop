package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/codes"
)

var (
	tracer = otel.Tracer(schemaName)
	logger = otelslog.NewLogger(schemaName)
)

type gameRequest struct {
	Name string `json:"name"`
}

type gameResponse struct {
	PlayerName   string `json:"playerName"`
	PlayerRoll   int    `json:"playerRoll"`
	ComputerRoll int    `json:"computerRoll"`
	Result       string `json:"result"`
}

func gameserver(w http.ResponseWriter, r *http.Request) {
	ctx, span := tracer.Start(r.Context(), "play") // Begin a new child span called 'play'
	defer span.End()

	var req gameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.ErrorContext(ctx, "ERROR: Invalid request body: %v\n", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	msg := fmt.Sprintf("Player %s is playing", req.Name)
	logger.InfoContext(ctx, msg, slog.String("player.name", req.Name))

	playerRoll, err := rollDice(ctx, req.Name)
	if err != nil {
		logger.ErrorContext(ctx, "ERROR: Error while rolling dice: %v\n", err)
		span.SetStatus(codes.Error, "Rolling player dice failed")
		span.RecordError(err)
		http.Error(w, "Error rolling dice", http.StatusInternalServerError)
		return
	}

	computerRoll, err := rollDice(ctx, "Computer")
	if err != nil {
		logger.ErrorContext(ctx, "ERROR: Error while rolling dice: %v\n", err)
		span.SetStatus(codes.Error, "Rolling computer dice failed")
		span.RecordError(err)
		http.Error(w, "Error rolling dice", http.StatusInternalServerError)
		return
	}

	resultCode, resultString, err := getResult(playerRoll, computerRoll)
	msg2 := fmt.Sprintf("Game result was %s", resultCode)
	logger.InfoContext(ctx, msg2)

	if err != nil {
		logger.ErrorContext(ctx, "ERROR: Error while calculating result")
		span.SetStatus(codes.Error, "getResult failed")
		span.RecordError(err)
		http.Error(w, "Error while calculating result", http.StatusInternalServerError)
		return
	}

	resp := gameResponse{
		PlayerName:   req.Name,
		PlayerRoll:   playerRoll,
		ComputerRoll: computerRoll,
		Result:       resultString,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func rollDice(ctx context.Context, name string) (int, error) {
	baseURL := "http://localhost:8080/rolldice"
	params := url.Values{}
	params.Add("player", name)

	url := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	// Create a new client and wrap it with a span, injecting the span context into the outbound headers
	client := http.Client{Transport: otelhttp.NewTransport(http.DefaultTransport)}
	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)

	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	roll, err := strconv.Atoi(strings.TrimSpace(string(body)))
	if err != nil || roll < 1 || roll > 6 {
		return 0, fmt.Errorf("invalid dice roll: %s", body)
	}

	return roll, nil
}

func getResult(playerRoll, computerRoll int) (string, string, error) {
	switch {
	case playerRoll > computerRoll:
		return "PLAYER", "You win!", nil
	case playerRoll < computerRoll:
		return "COMPUTER", "Computer wins!", nil
	default:
		return "", "", errors.New("No winner - unexpected tie between players!!")
	}
}
