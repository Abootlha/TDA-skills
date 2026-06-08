package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"

	"github.com/tdaskills/backend/internal/config"
)

// RedisClient wraps the go-redis client.
type RedisClient struct {
	Client *redis.Client
}

// NewRedis creates a new Redis connection.
func NewRedis(cfg config.RedisConfig) (*RedisClient, error) {
	client := redis.NewClient(&redis.Options{
		Addr:         cfg.Addr(),
		Password:     cfg.Password,
		DB:           cfg.DB,
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
		PoolSize:     20,
		MinIdleConns: 5,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to ping redis: %w", err)
	}

	log.Printf("✅ Redis connected: %s", cfg.Addr())

	return &RedisClient{Client: client}, nil
}

// Close shuts down the Redis connection.
func (r *RedisClient) Close() error {
	return r.Client.Close()
}

// Set stores a key-value pair with an expiration.
func (r *RedisClient) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	return r.Client.Set(ctx, key, value, expiration).Err()
}

// Get retrieves a value by key.
func (r *RedisClient) Get(ctx context.Context, key string) (string, error) {
	return r.Client.Get(ctx, key).Result()
}

// Del deletes one or more keys.
func (r *RedisClient) Del(ctx context.Context, keys ...string) error {
	return r.Client.Del(ctx, keys...).Err()
}

// Exists checks if a key exists.
func (r *RedisClient) Exists(ctx context.Context, key string) (bool, error) {
	n, err := r.Client.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return n > 0, nil
}

// Incr increments a key and returns the new value.
func (r *RedisClient) Incr(ctx context.Context, key string) (int64, error) {
	return r.Client.Incr(ctx, key).Result()
}

// Expire sets a TTL on a key.
func (r *RedisClient) Expire(ctx context.Context, key string, expiration time.Duration) error {
	return r.Client.Expire(ctx, key, expiration).Err()
}

// LPush prepends one or multiple values to a list.
func (r *RedisClient) LPush(ctx context.Context, key string, values ...interface{}) error {
	return r.Client.LPush(ctx, key, values...).Err()
}

// BRPop is a blocking list pop primitive.
func (r *RedisClient) BRPop(ctx context.Context, timeout time.Duration, keys ...string) ([]string, error) {
	return r.Client.BRPop(ctx, timeout, keys...).Result()
}

