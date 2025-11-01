package main

import (
	"log"
	"notes-app/internal/db"
	"notes-app/internal/handlers"
	"notes-app/internal/models"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize database
	db.Init()

	// Seed database with dummy account
	seedDatabase()

	// Create Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Notes API is running"})
	})

	// Auth routes (public)
	auth := r.Group("/api/auth")
	{
		auth.POST("/signup", handlers.Signup)
		auth.POST("/login", handlers.Login)
	}

	// Protected routes
	api := r.Group("/api")
	api.Use(handlers.AuthMiddleware())
	{
		// User routes
		api.GET("/profile", handlers.GetProfile)

		// Notes routes
		api.GET("/notes", handlers.GetNotes)
		api.POST("/notes", handlers.CreateNote)
		api.GET("/notes/:id", handlers.GetNote)
		api.PUT("/notes/:id", handlers.UpdateNote)
		api.DELETE("/notes/:id", handlers.DeleteNote)
		api.PATCH("/notes/:id/star", handlers.ToggleStarNote)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(r.Run(":" + port))
}

// seedDatabase creates a dummy account for testing
func seedDatabase() {
	// Check if dummy user already exists
	var existingUser models.User
	result := db.GetDB().Where("email = ?", "demo@example.com").First(&existingUser)
	
	// If user doesn't exist, create it
	if result.Error != nil {
		hashedPassword, _ := models.HashPassword("demo123456")
		dummyUser := models.User{
			Email:    "demo@example.com",
			Password: hashedPassword,
		}
		db.GetDB().Create(&dummyUser)
		log.Println("Dummy user created: demo@example.com / demo123456")
	} else {
		log.Println("Dummy user already exists: demo@example.com / demo123456")
	}
}

