package cloudflare

import (
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"github.com/tdaskills/backend/internal/config"
)

// R2Client wraps the S3-compatible Cloudflare R2 client.
type R2Client struct {
	client    *s3.Client
	presigner *s3.PresignClient
	bucket    string
	publicURL string
}

// NewR2Client creates a new Cloudflare R2 client.
func NewR2Client(cfg config.CloudflareConfig) (*R2Client, error) {
	if cfg.R2Endpoint == "" || cfg.R2AccessKey == "" {
		return &R2Client{bucket: cfg.R2Bucket, publicURL: cfg.R2PublicURL}, nil
	}

	resolver := aws.EndpointResolverWithOptionsFunc(
		func(service, region string, options ...interface{}) (aws.Endpoint, error) {
			return aws.Endpoint{
				URL: cfg.R2Endpoint,
			}, nil
		},
	)

	awsCfg, err := awsconfig.LoadDefaultConfig(context.TODO(),
		awsconfig.WithEndpointResolverWithOptions(resolver),
		awsconfig.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(cfg.R2AccessKey, cfg.R2SecretKey, ""),
		),
		awsconfig.WithRegion("auto"),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to load R2 config: %w", err)
	}

	client := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.UsePathStyle = true
	})

	return &R2Client{
		client:    client,
		presigner: s3.NewPresignClient(client),
		bucket:    cfg.R2Bucket,
		publicURL: cfg.R2PublicURL,
	}, nil
}

// GeneratePresignedUploadURL creates a presigned PUT URL for direct client upload.
func (r *R2Client) GeneratePresignedUploadURL(ctx context.Context, key, contentType string) (string, error) {
	if r.presigner == nil {
		return "", fmt.Errorf("R2 client not configured")
	}

	presignResult, err := r.presigner.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(r.bucket),
		Key:         aws.String(key),
		ContentType: aws.String(contentType),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = 15 * time.Minute
	})

	if err != nil {
		return "", fmt.Errorf("failed to presign URL: %w", err)
	}

	return presignResult.URL, nil
}

// DeleteObject removes a file from R2.
func (r *R2Client) DeleteObject(ctx context.Context, key string) error {
	if r.client == nil {
		return fmt.Errorf("R2 client not configured")
	}

	_, err := r.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(r.bucket),
		Key:    aws.String(key),
	})
	return err
}

// GetPublicURL returns the public URL for a stored object.
func (r *R2Client) GetPublicURL(key string) string {
	return r.publicURL + "/" + key
}

// IsConfigured returns true if the client has active configurations and is not placeholders.
func (r *R2Client) IsConfigured() bool {
	return r.client != nil && r.bucket != "" && r.bucket != "tdaskills" && r.publicURL != "" && !strings.Contains(r.publicURL, "tdaskills.r2.dev")
}

// UploadObject uploads a file direct to Cloudflare R2 bucket.
func (r *R2Client) UploadObject(ctx context.Context, key string, body io.Reader, contentType string) (string, error) {
	if r.client == nil {
		return "", fmt.Errorf("R2 client is not configured")
	}

	_, err := r.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(r.bucket),
		Key:         aws.String(key),
		Body:        body,
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload object to R2: %w", err)
	}

	return r.GetPublicURL(key), nil
}
