package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"klickz-redirect/internal/data"
	"klickz-redirect/internal/jsonlog"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/websocket"
)

const version = "1.0.0"

// @title gin-api-template Swagger API
// @version 1.0
// @description Swagger API for gin backend template.

type config struct {
	Port int    `json:"port"` //Network Port
	Env  string `json:"env"`  //Current operating environment
	Db   struct {
		Dsn          string `json:"dsn"` //Database connection
		MaxOpenConns int    `json:"maxOpenConns"`
		MaxIdleConns int    `json:"maxIdleConns"`
		MaxIdleTime  string `json:"maxIdleTime"`
	} `json:"db"`
	Jwtkeystring string `json:"jwtkey"`
	Jwtkey       []byte
	Limiter      struct {
		Rps     float64 `json:"rps"`      //Allowed requests per second
		Burst   int     `json:"burst"`    //Num of  maximum requests in single burst
		Enabled bool    `json:"disabled"` //Is Rate Limiter is on
	} `json:"limiter"`
	Wsdsn string `json:"wsdsn"`

	// cors struct {
	// 	trustedOrigins []string
	// }
}

type request struct {
	RequestId int64  `json:"requestId"`
	Ip        string `json:"ip"`
}

type Response struct {
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

type application struct {
	config   config
	logger   *jsonlog.Logger
	models   data.Models
	wg       sync.WaitGroup
	requests chan request
}

func main() {
	//var cfg config
	conf, err := os.Open("./cmd/configs/config.json")
	if err != nil {
		fmt.Println(err)
	}
	defer conf.Close()

	byteValue, _ := ioutil.ReadAll(conf)

	var configs config
	err = json.Unmarshal(byteValue, &configs)
	if err != nil {
		fmt.Println(err)
		return
	}

	copy(configs.Jwtkey, configs.Jwtkey)

	logger := jsonlog.New(os.Stdout, jsonlog.LevelInfo)

	db, err := openDB(configs)
	if err != nil {
		logger.PrintFatal(err, nil)
	}

	requests := make(chan request)

	app := &application{
		config:   configs,
		logger:   logger,
		models:   data.NewModes(db),
		requests: requests,
	}
	go app.connectToIpparser(configs)

	err = app.Serve()

	if err != nil {
		logger.PrintFatal(err, nil)
	}

}

func openDB(cfg config) (*sql.DB, error) {
	db, err := sql.Open("mysql", cfg.Db.Dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(cfg.Db.MaxOpenConns)
	db.SetMaxIdleConns(cfg.Db.MaxIdleConns)

	duration, err := time.ParseDuration(cfg.Db.MaxIdleTime)
	if err != nil {
		return nil, err
	}
	db.SetConnMaxIdleTime(duration)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func (app *application) connectToIpparser(cfg config) {

	//connecting to our ipparser server
	ws, _, err := websocket.DefaultDialer.Dial(cfg.Wsdsn, nil)
	if err != nil {
		app.logger.PrintError(err, nil)
	}

	defer ws.Close()
	defer app.connectToIpparser(cfg)

	//creating goroutine for sending requests to ipparser server
	go func() {
		for {
			request := <-app.requests
			err = ws.WriteJSON(request)
			if err != nil {
				app.logger.PrintError(err, nil)
			}
		}
	}()

	//waiting for messages to update requests in database
	//waiting for close message
	for {
		// Read Messages
		msgType, msgContent, err := ws.ReadMessage()

		if err != nil || msgType == websocket.CloseMessage {

			app.connectToIpparser(cfg)
			break

		} else if msgType == websocket.TextMessage {

			//receiving new message
			var req Response
			err = json.Unmarshal(msgContent, &req)
			if err != nil {
				ws.WriteJSON(gin.H{"error": "can not unmarshal message"})
			} else {
				//saving metadata to database on retrieved id
				err = app.models.Request.UpdateMetadata(req.RequestId, req.CountryLong, req.Region, req.City,
					req.Latitude, req.Longitude, req.Zipcode, req.Timezone)
				if err != nil {
					app.logger.PrintError(err, nil)
				}
			}

		}

	}

}
