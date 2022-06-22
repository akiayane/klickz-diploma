package data

import (
	"database/sql"
	"errors"
	"time"
)

type User struct {
	Id          int64     `json:"id"`
	Login       string    `json:"login"`
	Password    string    `json:"password"`
	Phone       string    `json:"phone"`
	Email       string    `json:"email"`
	Name        string    `json:"name"`
	Surname     string    `json:"surname"`
	FileId      int64     `json:"fileId"`
	Apitoken    string    `json:"apitoken"`
	Verified    bool      `json:"verified"`
	CreatedTime time.Time `json:"createdTime"`
}

type UserModel struct {
	DB *sql.DB
}

func (m *UserModel) Get(id int64) (*User, error) {
	stmt := `SELECT id, login, password, phone, email, name, surname, fileId, verified, createdTime FROM users WHERE id = ?;`
	rows := m.DB.QueryRow(stmt, id)

	u := &User{}
	err := rows.Scan(&u.Id, &u.Login, &u.Password, &u.Phone, &u.Email, &u.Name, &u.Surname, &u.FileId, &u.Verified, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *UserModel) GetByLogin(login string) (*User, error) {
	stmt := `SELECT id, login, password, phone, email, name, surname, fileId, verified, createdTime FROM users WHERE login = ?;`
	rows := m.DB.QueryRow(stmt, login)

	u := &User{}
	err := rows.Scan(&u.Id, &u.Login, &u.Password, &u.Phone, &u.Email, &u.Name, &u.Surname, &u.FileId, &u.Verified, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *UserModel) GetByPhone(phone string) (*User, error) {
	stmt := `SELECT id, login, password, phone, email, name, surname, fileId, verified, createdTime FROM users WHERE phone = ?;`
	rows := m.DB.QueryRow(stmt, phone)

	u := &User{}
	err := rows.Scan(&u.Id, &u.Login, &u.Password, &u.Phone, &u.Email, &u.Name, &u.Surname, &u.FileId, &u.Verified, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *UserModel) Insert(login, password, phone string, verified bool) (int, error) {
	stmt := `INSERT INTO users (login, password, phone, verified) VALUES (?,?,?,?)`

	result, err := m.DB.Exec(stmt, login, password, phone, verified)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *UserModel) UpdateAll(id int64, login, password, phone string, verified bool) error {
	stmt := `UPDATE users SET login = ?, password = ?, phone = ?, verified = ? WHERE id = ?`

	result, err := m.DB.Exec(stmt, login, password, phone, verified, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *UserModel) UpdateNameSurnameEmail(id int64, name, surname, email string) error {
	stmt := `UPDATE users SET name = ?, surname = ?, email = ? WHERE id = ?`

	result, err := m.DB.Exec(stmt, name, surname, email, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *UserModel) Verify(phone string) error {
	stmt := `UPDATE users SET verified = 1 WHERE phone = ?`

	result, err := m.DB.Exec(stmt, phone)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *UserModel) Delete(id int) error {
	stmt := `DELETE FROM users WHERE id = ?;`

	result, err := m.DB.Exec(stmt, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *UserModel) GetOwner(linkId int64) (*User, error) {
	stmt := `SELECT id, login, password, phone, email, name, surname, fileId, verified, createdTime FROM users 
	WHERE id = (SELECT userId FROM links_users WHERE role = 'owner' AND linkId = ?);`
	rows := m.DB.QueryRow(stmt, linkId)

	u := &User{}
	err := rows.Scan(&u.Id, &u.Login, &u.Password, &u.Phone, &u.Email, &u.Name, &u.Surname, &u.FileId, &u.Verified, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}
