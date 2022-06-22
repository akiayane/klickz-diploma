package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"klickz-backend/internal/data"
	"klickz-backend/internal/jsonlog"
	"os"
	"sync"
	"time"

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
	MySecret string `json:"mySecret"`

	// cors struct {
	// 	trustedOrigins []string
	// }
}

type application struct {
	config                 config
	logger                 *jsonlog.Logger
	models                 data.Models
	wg                     sync.WaitGroup
	hospitalsTVconnections map[int64][]*websocket.Conn
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
	hospitalsTVconnections := make(map[int64][]*websocket.Conn)

	app := &application{
		config:                 configs,
		logger:                 logger,
		models:                 data.NewModes(db),
		hospitalsTVconnections: hospitalsTVconnections,
	}
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
