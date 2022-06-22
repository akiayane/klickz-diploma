package data

import "database/sql"

type Healthcheck struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

type Models struct {
	User     UserModel
	Link     LinkModel
	Request  RequestModel
	Apitoken ApitokenModel
}

func NewModes(db *sql.DB) Models {
	return Models{
		UserModel{DB: db},
		LinkModel{DB: db},
		RequestModel{DB: db},
		ApitokenModel{DB: db},
	}
}
