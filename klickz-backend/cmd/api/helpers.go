package main

import (
	"encoding/hex"
	"fmt"
	"io/ioutil"
	data "klickz-backend/internal/data"
	"log"
	"math/rand"
	"net"
	"net/http"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"

	"github.com/ip2location/ip2location-go"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(bytes), err
}

func CompareHash(password string, hash string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err == nil {
		return true, nil
	} else if err.Error() == "crypto/bcrypt: hashedPassword is not the hash of the given password" {
		return false, nil
	}
	return false, err
}

// func GenerateJWTManager(jwtkey []byte, account *data.Account) (string, error) {
// 	token := jwt.New(jwt.SigningMethodHS256)

// 	claims := token.Claims.(jwt.MapClaims)

// 	claims["authorized"] = true
// 	claims["login"] = account.Login
// 	claims["hospitalId"] = account.HospitalId
// 	claims["exp"] = time.Now().Add(time.Hour * 6).Unix()

// 	tokenString, err := token.SignedString(jwtkey)

// 	if err != nil {
// 		fmt.Errorf("Something Went Wrong: %s", err.Error())
// 		return "", err
// 	}

// 	return tokenString, nil
// }

func GenerateSecureToken(length int) string {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return hex.EncodeToString(b)
}

func GenerateJWTUser(jwtkey []byte, user *data.User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)

	claims["authorized"] = true
	claims["login"] = user.Login
	claims["id"] = user.Id
	claims["exp"] = time.Now().Add(time.Minute * 60 * 2).Unix()

	tokenString, err := token.SignedString(jwtkey)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func makeRequest(url string) {
	_, err := http.Get(url)
	if err != nil {
		return
	}
}

func extractClaims(jwtkeybytes []byte, tokenStr string, secret string) (jwt.MapClaims, bool) {

	// To decrypt the original StringToEncrypt
	decText, err := Decrypt(tokenStr, secret)
	if err != nil {
		fmt.Println("error decrypting your encrypted text: ", err)
	}

	hmacSecret := jwtkeybytes
	token, err := jwt.Parse(decText, func(token *jwt.Token) (interface{}, error) {
		// check token signing method etc
		return hmacSecret, nil
	})

	if err != nil {
		return nil, false
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, true
	} else {
		log.Printf("Invalid JWT Token")
		return nil, false
	}
}

func getIP(r *http.Request) (string, error) {
	//Get IP from the X-REAL-IP header
	ip := r.Header.Get("X-REAL-IP")
	netIP := net.ParseIP(ip)
	if netIP != nil {
		return ip, nil
	}

	//Get IP from X-FORWARDED-FOR header
	ips := r.Header.Get("X-FORWARDED-FOR")
	splitIps := strings.Split(ips, ",")
	for _, ip := range splitIps {
		netIP := net.ParseIP(ip)
		if netIP != nil {
			return ip, nil
		}
	}

	//Get IP from RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return "", err
	}
	netIP = net.ParseIP(ip)
	if netIP != nil {
		return ip, nil
	}
	return "", fmt.Errorf("No valid ip found")
}

func sendSMS(code string, phone string) {
	/*sms := New("akiayane", "bigtimerush")
	sms.SetSender("Диспечер")
	sms.AddPhone(phone)

	fmt.Println(sms.phones)

	_, err := sms.Send("Ваш код активации: " + code)
	if err != nil {
		return
	}*/

	/*phone = strings.TrimPrefix(phone, "+")
	fmt.Println(phone)*/
	/*
		c, err := smsc.New(smsc.Config{Login: "akiayane", Password: "bigtimerush"})
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(c)
		msg := "Your code for authentication " + code + ", saktan.kz"
		_, err = c.Send(msg, []string{phone})
		if err != nil {
			log.Fatal(err)
		}*/
	/*msg := url.QueryEscape("Ваш код активации: " + code)
	fmt.Println(msg)
	command := "https://smsc.kz/sys/send.php?login=akiayane&psw=bigtimerush&phones="+phone+"&mes="+msg
	fmt.Println(command)
	resp, err := http.Get(command)
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	sb := string(body)
	log.Printf(sb)*/
}

func call(phone string) (string, error) {
	command := "https://smsc.kz/sys/send.php?login=akiayane&psw=bigtimerush&phones=" + phone + "&mes=code&call=1"
	//fmt.Println(command)
	resp, err := http.Get(command)
	if err != nil {
		//log.Fatalln(err)
		return "", err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		//log.Fatalln(err)
		return "", err
	}

	sb := string(body)
	code := sb[len(sb)-4:]
	//log.Printf(sb)

	return code, nil
}

func generateRandomNum() (num int) {
	rand.Seed(time.Now().UnixNano())
	min := 1000
	max := 9999
	return rand.Intn(max-min+1) + min
}

type ipInfo struct {
	CountryShort string
	CountryLong  string
	Region       string
	City         string
	Latitude     string
	Longitude    string
	Zipcode      string
	Timezone     string
}

func getIpInfo(ip string) (ipInfo, error) {
	db, err := ip2location.OpenDB("./IP2LOCATION-LITE-DB11.BIN")

	if err != nil {
		return ipInfo{}, err
	}

	results, err := db.Get_all(ip)

	if err != nil {
		return ipInfo{}, err
	}

	ipInfos := ipInfo{
		CountryShort: results.Country_short,
		CountryLong:  results.Country_long,
		Region:       results.Region,
		City:         results.City,
		Latitude:     fmt.Sprintf("%f", results.Latitude),
		Longitude:    fmt.Sprintf("%f", results.Longitude),
		Zipcode:      results.Zipcode,
		Timezone:     results.Timezone,
	}

	db.Close()

	return ipInfos, nil
}
