package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"klickz-ipparser/internal/jsonlog"
	"os"
	"sync"

	"github.com/ip2location/ip2location-go"
)

const version = "1.0.0"

// @title gin-api-template Swagger API
// @version 1.0
// @description Swagger API for gin backend template.

type config struct {
	Port    int    `json:"port"` //Network Port
	Env     string `json:"env"`  //Current operating environment
	Limiter struct {
		Rps     float64 `json:"rps"`      //Allowed requests per second
		Burst   int     `json:"burst"`    //Num of  maximum requests in single burst
		Enabled bool    `json:"disabled"` //Is Rate Limiter is on
	} `json:"limiter"`
	Wskey string `json:"wskey"`

	// cors struct {
	// 	trustedOrigins []string
	// }
}

type application struct {
	config config
	logger *jsonlog.Logger
	wg     sync.WaitGroup
	db     *ip2location.DB
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

	logger := jsonlog.New(os.Stdout, jsonlog.LevelInfo)

	db, err := openDB(configs)

	defer db.Close()

	if err != nil {
		logger.PrintFatal(err, nil)
	}

	app := &application{
		config: configs,
		logger: logger,
		db:     db,
	}

	err = app.Serve()
	if err != nil {
		logger.PrintFatal(err, nil)
	}

}

func openDB(cfg config) (*ip2location.DB, error) {
	db, err := ip2location.OpenDB("./IP2LOCATION-LITE-DB11.BIN")
	if err != nil {
		return nil, err
	}

	return db, nil
}
