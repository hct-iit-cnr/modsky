package main

import (
	"encoding/json"
	"net/http"

	"github.com/labstack/echo/v4"
)

const analyticsMaxBodyBytes = 1 << 20 // 1 MiB

type analyticsEvent struct {
	Source   string            `json:"source"`
	Event    string            `json:"event"`
	Payload  map[string]any    `json:"payload"`
	Metadata map[string]any    `json:"metadata"`
	Time     int64             `json:"time"`
}

type analyticsBatch struct {
	Events []analyticsEvent `json:"events"`
}

func analyticsHandler(c echo.Context) error {
	req := c.Request()
	req.Body = http.MaxBytesReader(c.Response(), req.Body, analyticsMaxBodyBytes)
	var payload analyticsBatch
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		log.Warnf("/t rejected invalid payload: %v", err)
		return c.NoContent(http.StatusBadRequest)
	}
	count := len(payload.Events)
	if count == 0 {
		log.Infof("/t received empty batch from %s", c.RealIP())
		return c.NoContent(http.StatusNoContent)
	}
	first := payload.Events[0]
	log.Infof("/t captured %d event(s); first=%s", count, first.Event)
	return c.NoContent(http.StatusNoContent)
}
