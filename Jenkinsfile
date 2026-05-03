pipeline {
    agent any

    environment {
        DOCKER_USER = "tanishq012"
        IMAGE_NAME = "myapp"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_USER}/${IMAGE_NAME}:latest")
                }
            }
        }

        stage('Push to Docker Hub') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            bat """
            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
            docker push %DOCKER_USER%/%IMAGE_NAME%:latest
            """
        }
    }
}
