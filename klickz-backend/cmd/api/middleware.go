package main

import (
	"errors"
	"fmt"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, Akis-Jwt-Token")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func (app *application) Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Header["Akis-Jwt-Token"] != nil {

			// To decrypt the original StringToEncrypt
			decText, err := Decrypt(c.Request.Header["Akis-Jwt-Token"][0], app.config.MySecret)
			if err != nil {
				fmt.Println("error decrypting your encrypted text: ", err)
			}

			token, err := jwt.Parse(decText, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, errors.New("SigningMethodHMAC checking error")
				}
				return app.config.Jwtkey, nil
			})

			if err != nil {
				if err.Error() == "Token is expired" {
					app.InvalidCredentials(err, c)
					c.Abort()
					return
				} else {
					app.serverErrorResponse(err, c)
					c.Abort()
					return
				}

			}

			if token.Valid {
				c.Next()
			}

		} else {
			app.NotAuthorized(nil, c)
			c.Abort()
			return
		}
	}
}
