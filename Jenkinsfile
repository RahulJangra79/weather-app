pipeline {
  agent any

  environment {
    IMAGE_NAME = 'sheetal79/vite-weather-app'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Build') {
      steps {
        bat 'npm install'
        bat 'npm run build'
      }
    }

    stage('Docker Build') {
      steps {
        bat 'docker build -t %IMAGE_NAME% .'
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          docker.withRegistry('', 'dockerhub-creds') {
            docker.image(IMAGE_NAME).push()
          }
        }
      }
    }

    stage('Deploy Locally') {
      steps {
        bat '''
          docker rm -f vite-weather || exit 0
          docker run -d --name vite-weather -p 8000:8000 %IMAGE_NAME%
        '''
      }
    }
  }
}
