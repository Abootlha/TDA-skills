package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jmoiron/sqlx"
	_ "github.com/jackc/pgx/v5/stdlib"

	"github.com/tdaskills/backend/internal/config"
)

// PostgresDB holds both the pgx pool (for high-performance queries) and sqlx DB (for named queries).
type PostgresDB struct {
	Pool *pgxpool.Pool
	DB   *sqlx.DB
}

// NewPostgres creates a new PostgreSQL connection.
func NewPostgres(cfg config.DatabaseConfig) (*PostgresDB, error) {
	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DB, cfg.SSLMode,
	)

	// pgx pool config
	poolCfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to parse pool config: %w", err)
	}
	poolCfg.MaxConns = int32(cfg.MaxConn)
	poolCfg.MinConns = int32(cfg.IdleConn)
	poolCfg.MaxConnLifetime = 1 * time.Hour
	poolCfg.MaxConnIdleTime = 30 * time.Minute

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, poolCfg)
	if err != nil {
		return nil, fmt.Errorf("failed to create pgx pool: %w", err)
	}

	// Verify connection
	if err := pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping postgres: %w", err)
	}

	// sqlx connection for named queries
	sqlxDSN := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DB, cfg.SSLMode,
	)
	db, err := sqlx.Connect("pgx", sqlxDSN)
	if err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to connect sqlx: %w", err)
	}
	db.SetMaxOpenConns(cfg.MaxConn)
	db.SetMaxIdleConns(cfg.IdleConn)
	db.SetConnMaxLifetime(1 * time.Hour)

	log.Printf("✅ PostgreSQL connected: %s:%s/%s", cfg.Host, cfg.Port, cfg.DB)

	return &PostgresDB{
		Pool: pool,
		DB:   db,
	}, nil
}

// Close shuts down both connections.
func (p *PostgresDB) Close() {
	p.Pool.Close()
	if err := p.DB.Close(); err != nil {
		log.Printf("error closing sqlx: %v", err)
	}
}
