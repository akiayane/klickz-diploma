package main

import (
	"klickz-backend/internal/data"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func (app *application) CreateLink(c *gin.Context) {

	var input data.Link

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	claims, _ := extractClaims(app.config.Jwtkey, c.Request.Header["Akis-Jwt-Token"][0], app.config.MySecret)
	userIdfl := claims["id"].(float64)
	userId := int64(userIdfl)

	shortLink := GenerateShortLink(input.Address)

	//creating linnk
	id, err := app.models.Link.Insert(shortLink, input.Address)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	//creating relation between user and link
	_, err = app.models.Link.InsertLinkUser(id, userId, "owner", true)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	c.JSON(http.StatusOK, gin.H{"payload": id})
	return
}

func (app *application) CreateLinkApi(c *gin.Context) {

	var input data.Link

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	//get userId

	token, err := app.models.Apitoken.GetByToken(c.Request.Header["Klickz-Api-Token"][0])
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.InvalidCredentials(nil, c)
			return

		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	//check if this user already have link with given address
	link, err := app.models.Link.GetByAddressAndOwner(input.Address, token.UserId)

	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			//if there is no link with given address and user create this link
			shortLink := GenerateShortLink(input.Address)

			//creating link
			id, err := app.models.Link.Insert(shortLink, input.Address)
			if err != nil {
				app.serverErrorResponse(err, c)
				return
			}

			//creating relation between user and link
			_, err = app.models.Link.InsertLinkUser(id, token.UserId, "owner", true)
			if err != nil {
				app.serverErrorResponse(err, c)
				return
			}

			//replace empty link with created one
			link, _ = app.models.Link.GetByAddressAndOwner(input.Address, token.UserId)

		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	link.Name = "https://klic.kz/l/" + link.Name
	//else if there is a link with this address return it
	c.JSON(http.StatusOK, gin.H{"payload": link})
	return
}

func (app *application) GetInvites(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var input data.User

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	//creating relation between user and link
	_, err := app.models.Link.InsertLinkUser(id, input.Id, "invited", false)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	c.JSON(http.StatusOK, gin.H{"payload": "Updated successfully"})
	return
}

func (app *application) GetAllInvites(c *gin.Context) {
	claims, _ := extractClaims(app.config.Jwtkey, c.Request.Header["Akis-Jwt-Token"][0], app.config.MySecret)
	userIdfl := claims["id"].(float64)
	userId := int64(userIdfl)

	//getting all invites
	invites, err := app.models.Link.GetAllInvites(userId)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.NotFoundResponse(nil, c)
			return

		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	var invitesExtended []data.InviteExtended

	for i, _ := range invites {
		user, err := app.models.User.GetOwner(invites[i].LinkId)
		if err != nil {
			app.serverErrorResponse(err, c)
			return
		}

		link, err := app.models.Link.Get(invites[i].LinkId)
		if err != nil {
			app.serverErrorResponse(err, c)
			return
		}

		invitesExtended = append(invitesExtended, data.InviteExtended{Link: link, User: user})
	}

	c.JSON(http.StatusOK, gin.H{"payload": invitesExtended})
	return
}

func (app *application) GivePermission(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var input data.User

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	//creating relation between user and link
	_, err := app.models.Link.InsertLinkUser(id, input.Id, "invited", false)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	c.JSON(http.StatusOK, gin.H{"payload": "Updated successfully"})
	return
}

func (app *application) AcceptPermission(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	claims, _ := extractClaims(app.config.Jwtkey, c.Request.Header["Akis-Jwt-Token"][0], app.config.MySecret)
	userIdfl := claims["id"].(float64)
	userId := int64(userIdfl)

	//updating relation between user and link
	err := app.models.Link.UpdateLinkUser(id, userId, true)
	if err != nil {
		if err.Error() == "no affected rows" {
			app.BadRequest(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": "Updated successfully"})
	return
}

func (app *application) GetAllLinks(c *gin.Context) {
	claims, _ := extractClaims(app.config.Jwtkey, c.Request.Header["Akis-Jwt-Token"][0], app.config.MySecret)
	userIdfl := claims["id"].(float64)
	userId := int64(userIdfl)

	links, err := app.models.Link.GetAllOwnerId(userId)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.NotFoundResponse(nil, c)
			return

		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	for i, v := range links {
		users, err := app.models.Link.GetOwnersByLinkId(v.Id)
		if err != nil {
			if err.Error() == "sql: no rows in result set" {

			} else {
				app.serverErrorResponse(err, c)
				return
			}
		}
		links[i].Users = users
	}

	c.JSON(http.StatusOK, gin.H{"payload": links})
	return
}

func (app *application) GetLinkData(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	requests, err := app.models.Request.GetByLinkId(id)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.NotFoundResponse(nil, c)
			return

		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": requests})
	return
}

func (app *application) GetRequestsNum(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	requests, err := app.models.Request.GetCountByLinkId(id)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.NotFoundResponse(nil, c)
			return

		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": requests})
	return
}

func (app *application) GetRequestsNum24Hours(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	requests, err := app.models.Request.GetCountByLinkIdInLast24(id)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.NotFoundResponse(nil, c)
			return

		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": requests})
	return
}

func inTimeSpan(start, end, check time.Time) string {
	if check.Unix() > start.Unix() && check.Unix() < end.Unix() {
		//fmt.Println("Comp", start.Unix(), check.Add(-time.Hour*6).Unix(), end.Unix(), "true")
		return "in interval"
	} else if check.Unix() > end.Unix() {
		return "in next"
	} else if check.Unix() < start.Unix() {
		return "in past"
	}
	//fmt.Println("Comp", start.Unix(), check.Add(-time.Hour*6).Unix(), end.Unix(), "false")
	return "err"
}

func (app *application) GetRequestsNumByTime24(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	requests, err := app.models.Request.GetByLinkIdInLast24(id)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.NotFoundResponse(nil, c)
			return

		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	type stat struct {
		Id        int       `json:"id"`
		Starttime time.Time `json:"starttime"`
		Count     int64     `json:"count"`
	}

	diff := 24 * time.Hour
	//endtime := time.Now()
	starttime := time.Now().Add(-diff)

	statistics := make([]stat, 0)

	//layout := "2022-05-02 15:23:18"
	// fmt.Println(time.Now().Format(requests[0].CreatedTime.String()), time.Now().UnixMilli())

	currentReq := 0
	for index := 0; index < 288; index++ {
		stat := stat{
			Id:        index,
			Starttime: starttime,
			Count:     0,
		}
		statistics = append(statistics, stat)

		for j := currentReq; j < len(requests); j++ {
			state := inTimeSpan(starttime, starttime.Add(time.Minute*5), requests[j].CreatedTime)
			if state == "in interval" {
				statistics[index].Count++
			} else if state == "in next" {
				currentReq = j
				break
			}
		}

		starttime = starttime.Add(time.Minute * 5)

	}

	//
	// for i, _ := range statistics {

	// 	fmt.Println(statistics[i])
	// }
	c.JSON(200, gin.H{"payload": statistics})
	return
}

func (app *application) GetRequestsNumByTime72(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	requests, err := app.models.Request.GetByLinkIdInLast72(id)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			app.NotFoundResponse(nil, c)
			return

		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	type stat struct {
		Id        int       `json:"id"`
		Starttime time.Time `json:"starttime"`
		Count     int64     `json:"count"`
	}

	diff := 72 * time.Hour
	//endtime := time.Now()
	starttime := time.Now().Add(-diff)

	statistics := make([]stat, 0)

	//layout := "2022-05-02 15:23:18"
	// fmt.Println(time.Now().Format(requests[0].CreatedTime.String()), time.Now().UnixMilli())

	currentReq := 0
	for index := 0; index < 24; index++ {
		stat := stat{
			Id:        index,
			Starttime: starttime,
			Count:     0,
		}
		statistics = append(statistics, stat)

		for j := currentReq; j < len(requests); j++ {
			state := inTimeSpan(starttime, starttime.Add(time.Hour*3), requests[j].CreatedTime)
			if state == "in interval" {
				statistics[index].Count++
			} else if state == "in next" {
				currentReq = j
				break
			}
		}

		starttime = starttime.Add(time.Hour * 3)

	}

	//
	// for i, _ := range statistics {

	// 	fmt.Println(statistics[i])
	// }
	c.JSON(200, gin.H{"payload": statistics})
	return
}

func (app *application) DisableLink(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	err := app.models.Link.UpdateIsActive(id, false)
	if err != nil {
		if err.Error() == "no affected rows" {
			app.BadRequest(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": "Updated successfully"})

}

func (app *application) RestoreLink(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	err := app.models.Link.UpdateIsActive(id, true)
	if err != nil {
		if err.Error() == "no affected rows" {
			app.BadRequest(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": "Updated successfully"})
	return

}

func (app *application) UpdateTags(c *gin.Context) {

	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var input data.Link

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	err := app.models.Link.UpdateTags(id, input.Tags)
	if err != nil {
		if err.Error() == "no affected rows" {
			app.BadRequest(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": "Updated successfully"})
	return

}

func (app *application) UpdateDisplayName(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var input data.Link

	if err := c.BindJSON(&input); err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	err := app.models.Link.UpdateDisplayName(id, input.DisplayName)
	if err != nil {
		if err.Error() == "no affected rows" {
			app.BadRequest(err, c)
			return
		} else {
			app.serverErrorResponse(err, c)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"payload": "Updated successfully"})
	return
}
