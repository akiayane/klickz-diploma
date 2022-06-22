package data

import (
	"database/sql"
	"errors"
	"time"
)

type Apitoken struct {
	Id          int64     `json:"id"`
	UserId      int64     `json:"userId"`
	Token       string    `json:"token"`
	CreatedTime time.Time `json:"createdTime"`
}

type ApitokenModel struct {
	DB *sql.DB
}

func (m *ApitokenModel) Get(id int64) (*Apitoken, error) {
	stmt := `SELECT id, userId, token, createdTime FROM apitokens WHERE id = ?;`
	rows := m.DB.QueryRow(stmt, id)

	u := &Apitoken{}
	err := rows.Scan(&u.Id, &u.UserId, &u.Token, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *ApitokenModel) GetByUserId(userId int64) (*Apitoken, error) {
	stmt := `SELECT id, userId, token, createdTime FROM apitokens WHERE userId = ?;`
	rows := m.DB.QueryRow(stmt, userId)

	u := &Apitoken{}
	err := rows.Scan(&u.Id, &u.UserId, &u.Token, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *ApitokenModel) GetByToken(token string) (*Apitoken, error) {
	stmt := `SELECT id, userId, token, createdTime FROM apitokens WHERE token = ?;`
	rows := m.DB.QueryRow(stmt, token)

	u := &Apitoken{}
	err := rows.Scan(&u.Id, &u.UserId, &u.Token, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *ApitokenModel) Insert(userId int64, token string) (int, error) {
	stmt := `INSERT INTO apitokens (userId, token) VALUES (?,?)`

	result, err := m.DB.Exec(stmt, userId, token)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *ApitokenModel) Delete(id int) error {
	stmt := `DELETE FROM apitokens WHERE id = ?;`

	result, err := m.DB.Exec(stmt, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}
