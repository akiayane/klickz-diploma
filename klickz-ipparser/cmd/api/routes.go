package main

import (
	"github.com/gin-gonic/gin"

	"net/http"
)

func (app *application) routes() http.Handler {

	//this use logger and recovery middleware by default, use in dev mode.
	//router := gin.Default()

	//this has no logger and recovery, so include it in middleware list if needed.
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()

	//if we need to serve static uploads or return html use following
	/*
		router.LoadHTMLGlob("./ui/*.html")
		router.Static("/api/serve", "./ui/")
	*/

	//list middleware that u want to include by default
	router.Use(
		//enabling AllowAllOrigins = true
		//cors.Default(),
		CORSMiddleware(),

	//include in prod mode
	//gin.Recovery(),
	)

	router.GET("/ipparser/healthcheck", app.Healthcheck)
	router.GET("/ipparser/get/:ip", app.GetIpInfo)

	router.GET("/ipparser/ws", app.wsEndpoint)

	return router
}
