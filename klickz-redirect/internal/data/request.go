package data

import (
	"database/sql"
	"errors"
	"time"
)

type Request struct {
	Id          int64     `json:"id"`
	LinkId      int64     `json:"linkId"`
	Ip          string    `json:"ip"`
	Device      string    `json:"device"`
	Country     string    `json:"country"`
	Region      string    `json:"region"`
	City        string    `json:"city"`
	Latitude    string    `json:"latitude"`
	Longitude   string    `json:"longitude"`
	Zipcode     string    `json:"zipcode"`
	Timezone    string    `json:"timezone"`
	Fullheader  string    `json:"fullheader"`
	CreatedTime time.Time `json:"createdTime"`
}

type Count struct {
	Count  int64 `json:"count"`
	LinkId int64 `json:"linkId"`
}

type RequestModel struct {
	DB *sql.DB
}

func (m *RequestModel) GetByLinkId(id int64) ([]*Request, error) {
	stmt := `SELECT id, linkId, ip, device, country, region, city, latitude, longitude, zipcode, timezone, fullheader, createdTime FROM requests WHERE linkId = ?;`
	rows, err := m.DB.Query(stmt, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var requests []*Request
	for rows.Next() {
		u := &Request{}
		err = rows.Scan(&u.Id, &u.LinkId, &u.Ip, &u.Device,
			&u.Country, &u.Region, &u.City, &u.Latitude, &u.Longitude, &u.Zipcode, &u.Timezone, &u.Fullheader, &u.CreatedTime)
		if err != nil {
			return nil, err
		}
		requests = append(requests, u)
	}

	if len(requests) == 0 {
		return nil, sql.ErrNoRows
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return requests, nil
}

func (m *RequestModel) GetCountByLinkId(id int64) (*Count, error) {
	stmt := `SELECT COUNT(*) FROM requests WHERE linkId = ?;`
	rows := m.DB.QueryRow(stmt, id)

	u := &Count{}
	err := rows.Scan(&u.Count)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *RequestModel) GetCountByLinkIdInLast24(id int64) (*Count, error) {
	stmt := `SELECT COUNT(*) FROM requests WHERE linkId = ? AND createdTime >= NOW() - INTERVAL 1 DAY;`
	rows := m.DB.QueryRow(stmt, id)

	u := &Count{}
	err := rows.Scan(&u.Count)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *RequestModel) GetByLinkIdInLast24(id int64) ([]*Request, error) {
	stmt := `SELECT id, linkId, ip, device, country, region, city, latitude, longitude, zipcode, timezone, fullheader, createdTime FROM requests 
	WHERE linkId = ? AND createdTime >= DATE_SUB(NOW(), INTERVAL 24 HOUR);`
	rows, err := m.DB.Query(stmt, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var requests []*Request
	for rows.Next() {
		u := &Request{}
		err = rows.Scan(&u.Id, &u.LinkId, &u.Ip, &u.Device,
			&u.Country, &u.Region, &u.City, &u.Latitude, &u.Longitude, &u.Zipcode, &u.Timezone, &u.Fullheader, &u.CreatedTime)
		if err != nil {
			return nil, err
		}
		requests = append(requests, u)
	}

	if len(requests) == 0 {
		return nil, sql.ErrNoRows
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return requests, nil
}

func (m *RequestModel) GetByLinkIdInLast72(id int64) ([]*Request, error) {
	stmt := `SELECT id, linkId, ip, device, country, region, city, latitude, longitude, zipcode, timezone, fullheader, createdTime FROM requests 
	WHERE linkId = ? AND createdTime >= NOW() - INTERVAL 72 HOUR;`
	rows, err := m.DB.Query(stmt, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var requests []*Request
	for rows.Next() {
		u := &Request{}
		err = rows.Scan(&u.Id, &u.LinkId, &u.Ip, &u.Device,
			&u.Country, &u.Region, &u.City, &u.Latitude, &u.Longitude, &u.Zipcode, &u.Timezone, &u.Fullheader, &u.CreatedTime)
		if err != nil {
			return nil, err
		}
		requests = append(requests, u)
	}

	if len(requests) == 0 {
		return nil, sql.ErrNoRows
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return requests, nil
}

func (m *RequestModel) Insert(linkId int64, ip, device, country, region, city, latitude, longitude, zipcode, timezone, fullheader string) (int, error) {
	stmt := `INSERT INTO requests (linkId, ip, device, country, region, city, latitude, longitude, zipcode, timezone, fullheader) VALUES (?,?,?,?,?,?,?,?,?,?,?)`

	result, err := m.DB.Exec(stmt, linkId, ip, device, country, region, city, latitude, longitude, zipcode, timezone, fullheader)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *RequestModel) InsertLight(linkId int64, ip, device, fullheader string) (int64, error) {
	stmt := `INSERT INTO requests (linkId, ip, device, fullheader) VALUES (?,?,?,?)`

	result, err := m.DB.Exec(stmt, linkId, ip, device, fullheader)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (m *RequestModel) UpdateMetadata(id int64, country, region, city, latitude, longitude, zipcode, timezone string) error {
	stmt := `UPDATE requests SET country = ?, region = ?, city = ?, latitude = ?, longitude = ?, zipcode = ?, timezone = ? WHERE id = ?;`

	result, err := m.DB.Exec(stmt, country, region, city, latitude, longitude, zipcode, timezone, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *RequestModel) Delete(id int) error {
	stmt := `DELETE FROM requests WHERE id = ?;`

	result, err := m.DB.Exec(stmt, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}
