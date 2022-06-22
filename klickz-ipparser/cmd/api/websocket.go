package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type request struct {
	RequestId int64  `json:"requestId"`
	Ip        string `json:"ip"`
}

type response struct {
	RequestId    int64  `json:"requestId"`
	CountryShort string `json:"countryShort"`
	CountryLong  string `json:"countryLong"`
	Region       string `json:"region"`
	City         string `json:"city"`
	Latitude     string `json:"latitude"`
	Longitude    string `json:"longitude"`
	Zipcode      string `json:"zipcode"`
	Timezone     string `json:"timezone"`
}

func (app *application) wsEndpoint(c *gin.Context) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	//retrieving data
	params := c.Request.URL.Query()
	key := params.Get("wskey")

	if key != app.config.Wskey {
		app.InvalidCredentials(nil, c)
		return
	}

	//upgrading to websocket connection
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		app.serverErrorResponse(err, c)
	}

	defer ws.Close()

	//waiting for close message
	for {
		// Read Messages
		msgType, msgContent, err := ws.ReadMessage()

		if err != nil || msgType == websocket.CloseMessage {

			break // Close connection if client leaving
		} else if msgType == websocket.TextMessage {

			go func() {
				var req request
				err = json.Unmarshal(msgContent, &req)
				if err != nil {
					ws.WriteJSON(gin.H{"error": "can not unmarshal message"})
				} else {
					fmt.Println(req)

					//getting ip metadata from bin
					results, err := app.db.Get_all(req.Ip)
					if err != nil {
						ws.WriteJSON(gin.H{"error": "can not retrieve metadata"})
					}

					ipInfos := response{
						RequestId:    req.RequestId,
						CountryShort: results.Country_short,
						CountryLong:  results.Country_long,
						Region:       results.Region,
						City:         results.City,
						Latitude:     fmt.Sprintf("%f", results.Latitude),
						Longitude:    fmt.Sprintf("%f", results.Longitude),
						Zipcode:      results.Zipcode,
						Timezone:     results.Timezone,
					}

					ws.WriteJSON(ipInfos)
				}
			}()

		}

	}

}
