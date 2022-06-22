package main

import (
	"fmt"
	"io/ioutil"
	"klickz-backend/internal/data"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func (app *application) GetUserData(c *gin.Context) {
	claims, _ := extractClaims(app.config.Jwtkey, c.Request.Header["Akis-Jwt-Token"][0], app.config.MySecret)
	login := claims["login"].(string)

	user, err := app.models.User.GetByLogin(login)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	userApitoken, err := app.models.Apitoken.GetByUserId(user.Id)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			//means user have no apitoken
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}
	if userApitoken != nil {
		user.Apitoken = userApitoken.Token
	}

	c.JSON(http.StatusOK, gin.H{"payload": user})
	return
}

func (app *application) GetUsersByLogin(c *gin.Context) {
	var input data.User

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	input.Login = strings.Trim(input.Login, " ")

	users, err := app.models.User.GetAllByLogin(input.Login)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.NotFoundResponse(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": users})
	return
}

func (app *application) UpdateNameSurnameEmail(c *gin.Context) {
	claims, _ := extractClaims(app.config.Jwtkey, c.Request.Header["Akis-Jwt-Token"][0], app.config.MySecret)
	id := claims["id"].(float64)
	userId := int64(id)

	var input data.User

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	err := app.models.User.UpdateNameSurnameEmail(userId, input.Name, input.Surname, input.Email)
	if err != nil {
		if err.Error() == "no affected rows" {
			app.BadRequest(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": "updated successfully"})
	return
}

func (app *application) CreateApiToken(c *gin.Context) {
	claims, _ := extractClaims(app.config.Jwtkey, c.Request.Header["Akis-Jwt-Token"][0], app.config.MySecret)
	id := claims["id"].(float64)
	userId := int64(id)

	secureToken := GenerateSecureToken(16)

	insertId, err := app.models.Apitoken.Insert(userId, secureToken)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	token, err := app.models.Apitoken.Get(int64(insertId))
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.NotFoundResponse(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": token})
	return
}

func (app *application) Login(c *gin.Context) {
	var input data.User
	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}
	user, err := app.models.User.GetByLogin(input.Login)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.InvalidCredentials(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}
	logIn, err := CompareHash(input.Password, user.Password)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}
	if logIn {
		newJWT, err := GenerateJWTUser(app.config.Jwtkey, user)
		if err != nil {
			app.serverErrorResponse(err, c)
			return
		}
		encText, err := Encrypt(newJWT, app.config.MySecret)
		if err != nil {
			fmt.Println("error encrypting your classified text: ", err)
		}

		c.JSON(http.StatusOK, gin.H{"payload": encText})
		return

	} else {
		app.InvalidCredentials(err, c)
		return
	}
}

func (app *application) Registration(c *gin.Context) {
	var input data.User

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	phoneUsed := true
	loginUsed := true

	//checking if this login exists
	_, err := app.models.User.GetByLogin(input.Login)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			loginUsed = false
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	//checking if this phone exists
	_, err = app.models.User.GetByPhone(input.Phone)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			phoneUsed = false
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	//if both login and phone were not used
	if !(phoneUsed || loginUsed) {
		//creating user
		hashedPassword, err := HashPassword(input.Password)
		if err != nil {
			app.serverErrorResponse(err, c)
			return
		}
		id, err := app.models.User.Insert(input.Login, hashedPassword, input.Phone, false)
		if err != nil {
			app.serverErrorResponse(err, c)
			return
		}

		c.JSON(http.StatusOK, gin.H{"payload": id})
		return
	} else {

		c.JSON(http.StatusOK, gin.H{"payload": "User exists with same login or phone"})
		return
	}
}

func (app *application) StartVerfication(c *gin.Context) {
	var input data.User

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	code, err := call(input.Phone)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	c.JSON(http.StatusOK, gin.H{"payload": code})
	return

}

func (app *application) Verify(c *gin.Context) {
	var input data.User

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	err := app.models.User.Verify(input.Phone)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	c.JSON(http.StatusOK, gin.H{"payload": "Verified successfully"})
	return

}

func (app *application) FileUpload(c *gin.Context) {

	claims, _ := extractClaims(app.config.Jwtkey, c.Request.Header["Akis-Jwt-Token"][0], app.config.MySecret)
	id := claims["id"].(float64)
	userId := int64(id)

	name := c.Param("fileName")
	body := c.Request.Body
	photo, err := ioutil.ReadAll(body)
	if err != nil {
		fmt.Println(err)
	}

	path := "uploads/"

	tempFile, err := ioutil.TempFile(path, "*-"+name)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer tempFile.Close()

	_, err = tempFile.Write(photo)
	if err != nil {
		fmt.Println(err)
		return
	}

	err = app.models.User.UpdatePhotoUrl(userId, "/"+tempFile.Name())
	if err != nil {
		if err.Error() == "no affected rows" {
			app.BadRequest(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": tempFile.Name()})
	return
}
