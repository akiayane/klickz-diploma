package main

import (
	data "klickz-redirect/internal/data"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type IpParserResponse struct {
	Payload struct {
		CountryShort string `json:"countryShort"`
		CountryLong  string `json:"countryLong"`
		Region       string `json:"region"`
		City         string `json:"city"`
		Latitude     string `json:"latitude"`
		Longitude    string `json:"longitude"`
		Zipcode      string `json:"zipcode"`
		Timezone     string `json:"timezone"`
	} `json:"payload"`
}

// Healthcheck GetUser godoc
// @Summary Retrieves application status
// @Produce json
// @Success 200 {object} data.Healthcheck
// @Router /healthcheck [get]
func (app *application) Healthcheck(c *gin.Context) {

	health := &data.Healthcheck{
		Status:      "available",
		Environment: app.config.Env,
		Version:     version,
	}

	c.JSON(http.StatusOK, gin.H{"payload": health})

}

func (app *application) Redirect(c *gin.Context) {
	//getting link info
	name := c.Param("name")
	link, err := app.models.Link.GetByName(name)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}
	//redirecting user to resource
	go func() {
		http.Redirect(c.Writer, c.Request, link.Address, http.StatusSeeOther)
	}()
	//saving request info
	ip, err := getIP(c.Request)
	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	var allHeaders string
	for name, values := range c.Request.Header {
		for _, value := range values {
			allHeaders = allHeaders + name + ":" + value + ";"
		}
	}

	device := c.Request.Header.Get("User-Agent")[strings.Index(c.Request.Header.Get("User-Agent"), "(")+1 : strings.Index(c.Request.Header.Get("User-Agent"), ")")]

	requestId, err := app.models.Request.InsertLight(link.Id, ip, device, allHeaders)

	req := request{RequestId: requestId, Ip: ip}
	app.requests <- req

	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}
}
