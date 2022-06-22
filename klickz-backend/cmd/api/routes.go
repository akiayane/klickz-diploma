package main

import (
	"github.com/gin-gonic/gin"

	_ "klickz-backend/cmd/api/docs"

	"net/http"
)

func (app *application) routes() http.Handler {

	//this use logger and recovery middleware by default, use in dev mode.
	//router := gin.Default()

	//this has no logger and recovery, so include it in middleware list if needed.
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()

	//list middleware that u want to include by default
	router.Use(
		//enabling AllowAllOrigins = true
		//cors.Default(),
		CORSMiddleware(),
	)

	router.Static("/web/uploads", "./uploads/")

	web := router.Group("/web")
	{
		web.GET("/healthcheck", app.Healthcheck)

		common := web.Group("/common")
		{
			common.POST("/login", app.Login)
			common.POST("/registration", app.Registration)
			common.POST("/startverification", app.StartVerfication)
			common.POST("/verify", app.Verify)
		}

		auth := web.Group("/auth", app.Auth())
		{
			auth.GET("/userdata", app.GetUserData)
			auth.POST("/userdata/update", app.UpdateNameSurnameEmail)
			auth.POST("/userdata/uploadPhoto/:fileName", app.FileUpload)
			auth.GET("/userdata/createtoken", app.CreateApiToken)
			auth.GET("/userdata/invites", app.GetAllInvites)

			auth.POST("/users/get", app.GetUsersByLogin)

			link := auth.Group("/link")
			{
				link.POST("/create", app.CreateLink)
				link.GET("/get", app.GetAllLinks)

				link.GET("/get/:id/data", app.GetLinkData)
				link.GET("/get/:id/data/sum", app.GetRequestsNum)
				link.GET("/get/:id/data/sum24", app.GetRequestsNum24Hours)
				link.GET("/get/:id/data/bytime", app.GetRequestsNumByTime24)
				link.GET("/get/:id/data/bytime72", app.GetRequestsNumByTime72)

				link.GET("/update/:id/disable", app.DisableLink)
				link.GET("/update/:id/restore", app.RestoreLink)
				link.POST("/update/:id/tags", app.UpdateTags)
				link.POST("/update/:id/displayName", app.UpdateDisplayName)

				link.POST("/:id/invite", app.GivePermission)
				link.GET("/:id/accept", app.AcceptPermission)
			}
		}
	}

	api := router.Group("/api")
	{
		api.POST("/create", app.CreateLinkApi)
		api.GET("/get/:id/data", app.GetLinkData)
	}

	return router
}
