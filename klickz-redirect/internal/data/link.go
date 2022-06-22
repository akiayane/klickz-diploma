package data

import (
	"database/sql"
	"errors"
	"time"
)

type Link struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name"`
	Address     string    `json:"address"`
	DisplayName string    `json:"displayName"`
	Tags        string    `json:"tags"`
	IsActive    bool      `json:"isActive"`
	CreatedTime time.Time `json:"createdTime"`
}

type LinkExtended struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name"`
	Address     string    `json:"address"`
	DisplayName string    `json:"displayName"`
	Tags        string    `json:"tags"`
	IsActive    bool      `json:"isActive"`
	Users       []*User   `json:"users"`
	CreatedTime time.Time `json:"createdTime"`
}

type InviteExtended struct {
	Link *Link `json:"link"`
	User *User `json:"user"`
}

type Invite struct {
	LinkId int64 `json:"link"`
	UserId int64 `json:"user"`
}

type LinkModel struct {
	DB *sql.DB
}

func (m *LinkModel) GetAllInvites(userId int64) ([]*Invite, error) {
	stmt := `SELECT linkId, userId FROM links_users WHERE userId = ? AND role = 'invited' AND verified = 0;`
	rows, err := m.DB.Query(stmt, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var invites []*Invite
	for rows.Next() {
		u := &Invite{}
		err = rows.Scan(&u.LinkId, &u.UserId)
		if err != nil {
			return nil, err
		}
		invites = append(invites, u)
	}

	if len(invites) == 0 {
		return nil, sql.ErrNoRows
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return invites, nil
}

func (m *LinkModel) InsertLinkUser(linkId, userId int64, role string, verified bool) (int, error) {
	stmt := `INSERT INTO links_users (linkId, userId, role, verified) VALUES (?,?,?,?)`

	result, err := m.DB.Exec(stmt, linkId, userId, role, verified)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *LinkModel) UpdateLinkUser(linkId, userId int64, verified bool) error {
	stmt := `UPDATE links_users SET verified = ? WHERE userId = ? AND linkId = ?;`

	result, err := m.DB.Exec(stmt, verified, userId, linkId)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *LinkModel) Get(id int64) (*Link, error) {
	stmt := `SELECT id, name, address, displayName, tags, isActive, createdTime FROM links WHERE id = ?;`
	rows := m.DB.QueryRow(stmt, id)

	u := &Link{}
	err := rows.Scan(&u.Id, &u.Name, &u.Address, &u.DisplayName, &u.Tags, &u.IsActive, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *LinkModel) GetByName(name string) (*Link, error) {
	stmt := `SELECT id, name, address, displayName, tags, isActive, createdTime FROM links WHERE name = ? AND isActive = 1;`
	rows := m.DB.QueryRow(stmt, name)

	u := &Link{}
	err := rows.Scan(&u.Id, &u.Name, &u.Address, &u.DisplayName, &u.Tags, &u.IsActive, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *LinkModel) GetByAddressAndOwner(address string, userId int64) (*Link, error) {
	stmt := `SELECT id, name, address, displayName, tags, isActive, createdTime FROM links 
	WHERE address = ? AND id IN (SELECT linkId FROM links_users WHERE userId = ? AND verified = 1);`
	rows := m.DB.QueryRow(stmt, address, userId)

	u := &Link{}
	err := rows.Scan(&u.Id, &u.Name, &u.Address, &u.DisplayName, &u.Tags, &u.IsActive, &u.CreatedTime)
	if err != nil {
		return nil, err
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return u, nil
}

func (m *LinkModel) GetAllOwnerId(ownerId int64) ([]*LinkExtended, error) {
	stmt := `SELECT id, name, address, displayName, tags, isActive, createdTime FROM links 
	WHERE id IN (SELECT linkId FROM links_users WHERE userId = ? AND verified = 1) ORDER BY id;`
	rows, err := m.DB.Query(stmt, ownerId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var links []*LinkExtended
	for rows.Next() {
		u := &LinkExtended{}
		err = rows.Scan(&u.Id, &u.Name, &u.Address, &u.DisplayName, &u.Tags, &u.IsActive, &u.CreatedTime)
		if err != nil {
			return nil, err
		}
		links = append(links, u)
	}

	if len(links) == 0 {
		return nil, sql.ErrNoRows
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return links, nil
}

func (m *LinkModel) GetOwnersByLinkId(linkId int64) ([]*User, error) {
	stmt := `SELECT id, login FROM users WHERE id IN (SELECT userId FROM links_users WHERE linkId = ?) ORDER BY id;`
	rows, err := m.DB.Query(stmt, linkId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		u := &User{}
		err = rows.Scan(&u.Id, &u.Login)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	if len(users) == 0 {
		return nil, sql.ErrNoRows
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (m *LinkModel) Insert(name, address string) (int64, error) {
	stmt := `INSERT INTO links (name, address) VALUES (?,?)`

	result, err := m.DB.Exec(stmt, name, address)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int64(id), nil
}

func (m *LinkModel) UpdateAll(id int64, address string) error {
	stmt := `UPDATE links SET address = ? WHERE id = ?`

	result, err := m.DB.Exec(stmt, address, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *LinkModel) UpdateIsActive(id int64, isActive bool) error {
	stmt := `UPDATE links SET isActive = ? WHERE id = ?`

	result, err := m.DB.Exec(stmt, isActive, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *LinkModel) UpdateDisplayName(id int64, displayName string) error {
	stmt := `UPDATE links SET displayName = ? WHERE id = ?`

	result, err := m.DB.Exec(stmt, displayName, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *LinkModel) UpdateTags(id int64, tags string) error {
	stmt := `UPDATE links SET tags = ? WHERE id = ?`

	result, err := m.DB.Exec(stmt, tags, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}

func (m *LinkModel) Delete(id int) error {
	stmt := `DELETE FROM links WHERE id = ?;`

	result, err := m.DB.Exec(stmt, id)

	if err != nil {
		return err
	}

	if temp, _ := result.RowsAffected(); temp == 0 {
		return errors.New("no affected rows")
	}

	return nil
}
