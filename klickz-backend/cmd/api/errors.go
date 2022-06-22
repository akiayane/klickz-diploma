package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)


type SimpleError struct{
	Error string
}

func (app *application) serverErrorResponse(err error, c *gin.Context) {
	c.JSON(http.StatusInternalServerError, gin.H{"error":"Internal server error"})
	if err!=nil{
		app.logger.PrintError(err, nil)
	}
}

func (app *application) BadRequest(err error, c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"error":"Bad request"})
	if err!=nil{
		app.logger.PrintError(err, nil)
	}
}

func (app *application) NotAuthorized(err error, c *gin.Context) {
	c.JSON(http.StatusUnauthorized, gin.H{"error":"Not Authorized"})
	if err!=nil{
		app.logger.PrintError(err, nil)
	}
}

func (app *application) NotAcceptable(err error, c *gin.Context) {
	c.JSON(http.StatusNotAcceptable, gin.H{"error":"Not Acceptable"})
	if err!=nil{
		app.logger.PrintError(err, nil)
	}
}



func (app *application) NotFoundResponse(err error, c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{"error":"Not found"})
	if err!=nil{
		app.logger.PrintError(err, nil)
	}
}

func (app *application) NotAllowedResponse(err error, c *gin.Context) {
	c.JSON(http.StatusMethodNotAllowed, gin.H{"error":"Method not allowed"})
	if err!=nil{
		app.logger.PrintError(err, nil)
	}
}

func (app *application) InvalidCredentials(err error, c *gin.Context) {
	c.JSON(http.StatusUnauthorized, gin.H{"error":"Invalid credentials"})
	if err!=nil{
		app.logger.PrintError(err, nil)
	}
}

func (app *application) FailedValidationResponse(errors map[string]string, c *gin.Context) {
	c.JSON(http.StatusUnprocessableEntity, gin.H{"error":errors})
}

