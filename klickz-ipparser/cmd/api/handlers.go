package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Healthcheck struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

type IpInfo struct {
	CountryShort string `json:"countryShort"`
	CountryLong  string `json:"countryLong"`
	Region       string `json:"region"`
	City         string `json:"city"`
	Latitude     string `json:"latitude"`
	Longitude    string `json:"longitude"`
	Zipcode      string `json:"zipcode"`
	Timezone     string `json:"timezone"`
}

func (app *application) Healthcheck(c *gin.Context) {

	health := Healthcheck{
		Status:      "available",
		Environment: app.config.Env,
		Version:     version,
	}

	c.JSON(http.StatusOK, gin.H{"payload": health})

}

func (app *application) GetIpInfo(c *gin.Context) {
	ip := c.Param("ip")

	results, err := app.db.Get_all(ip)

	if err != nil {
		app.serverErrorResponse(err, c)
		return
	}

	ipInfos := IpInfo{
		CountryShort: results.Country_short,
		CountryLong:  results.Country_long,
		Region:       results.Region,
		City:         results.City,
		Latitude:     fmt.Sprintf("%f", results.Latitude),
		Longitude:    fmt.Sprintf("%f", results.Longitude),
		Zipcode:      results.Zipcode,
		Timezone:     results.Timezone,
	}

	c.JSON(http.StatusOK, gin.H{"payload": ipInfos})
}
