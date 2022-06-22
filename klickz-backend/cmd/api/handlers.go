package main

import (
	data "klickz-backend/internal/data"
	"net/http"

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
