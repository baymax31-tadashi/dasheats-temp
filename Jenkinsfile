// =============================================================================
// Jenkins CI/CD Pipeline for Food Ordering Application
// =============================================================================
// This pipeline automates the build, test, and deployment process
// =============================================================================

pipeline {
    agent any

    // -------------------------------------------------------------------------
    // Environment Variables
    // -------------------------------------------------------------------------
    environment {
        // Application
        APP_NAME = 'food-order-app'
        APP_VERSION = "${BUILD_NUMBER}"
        
        // Docker
        DOCKER_REGISTRY = credentials('docker-registry-url')
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        DOCKER_IMAGE = "${DOCKER_REGISTRY}/${APP_NAME}"
        DOCKER_TAG = "${APP_VERSION}"
        
        // Kubernetes
        KUBECONFIG = credentials('kubeconfig')
        K8S_NAMESPACE = 'food-order'
        
        // Node.js
        NODE_VERSION = '20'
    }

    // -------------------------------------------------------------------------
    // Pipeline Options
    // -------------------------------------------------------------------------
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }

    // -------------------------------------------------------------------------
    // Pipeline Stages
    // -------------------------------------------------------------------------
    stages {
        // ---------------------------------------------------------------------
        // Stage 1: Checkout
        // ---------------------------------------------------------------------
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
                
                script {
                    // Get commit info for tagging
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    env.GIT_BRANCH_NAME = sh(
                        script: 'git rev-parse --abbrev-ref HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }

        // ---------------------------------------------------------------------
        // Stage 2: Install Dependencies
        // ---------------------------------------------------------------------
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh '''
                    corepack enable pnpm
                    pnpm install --frozen-lockfile
                '''
            }
        }

        // ---------------------------------------------------------------------
        // Stage 3: Lint
        // ---------------------------------------------------------------------
        stage('Lint') {
            steps {
                echo '🔍 Running linter...'
                sh 'pnpm lint || true'
            }
        }

        // ---------------------------------------------------------------------
        // Stage 4: Build
        // ---------------------------------------------------------------------
        stage('Build') {
            steps {
                echo '🔨 Building application...'
                sh 'pnpm build'
            }
        }

        // ---------------------------------------------------------------------
        // Stage 5: Docker Build
        // ---------------------------------------------------------------------
        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker image...'
                sh """
                    docker build \
                        --tag ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        --tag ${DOCKER_IMAGE}:latest \
                        --tag ${DOCKER_IMAGE}:${GIT_COMMIT_SHORT} \
                        --build-arg BUILD_DATE=\$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                        --build-arg VERSION=${APP_VERSION} \
                        --build-arg GIT_COMMIT=${GIT_COMMIT_SHORT} \
                        .
                """
            }
        }

        // ---------------------------------------------------------------------
        // Stage 6: Docker Push
        // ---------------------------------------------------------------------
        stage('Docker Push') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            steps {
                echo '📤 Pushing Docker image to registry...'
                sh """
                    echo \$DOCKER_CREDENTIALS_PSW | docker login \$DOCKER_REGISTRY -u \$DOCKER_CREDENTIALS_USR --password-stdin
                    docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE}:latest
                    docker push ${DOCKER_IMAGE}:${GIT_COMMIT_SHORT}
                """
            }
        }

        // ---------------------------------------------------------------------
        // Stage 7: Deploy to Kubernetes
        // ---------------------------------------------------------------------
        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying to Kubernetes...'
                sh """
                    # Update image tag in kustomization
                    cd k8s
                    
                    # Apply Kubernetes manifests
                    kubectl --kubeconfig=\$KUBECONFIG apply -k .
                    
                    # Update deployment with new image
                    kubectl --kubeconfig=\$KUBECONFIG set image \
                        deployment/${APP_NAME} \
                        ${APP_NAME}=${DOCKER_IMAGE}:${DOCKER_TAG} \
                        -n ${K8S_NAMESPACE}
                    
                    # Wait for rollout to complete
                    kubectl --kubeconfig=\$KUBECONFIG rollout status \
                        deployment/${APP_NAME} \
                        -n ${K8S_NAMESPACE} \
                        --timeout=300s
                """
            }
        }

        // ---------------------------------------------------------------------
        // Stage 8: Health Check
        // ---------------------------------------------------------------------
        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                echo '🏥 Running health check...'
                sh """
                    # Wait for service to be ready
                    sleep 30
                    
                    # Get service endpoint and check health
                    SERVICE_IP=\$(kubectl --kubeconfig=\$KUBECONFIG get svc food-order-service \
                        -n ${K8S_NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
                    
                    if [ -n "\$SERVICE_IP" ]; then
                        curl -f http://\$SERVICE_IP/api/health || exit 1
                    else
                        echo "Service IP not available, skipping external health check"
                    fi
                """
            }
        }
    }

    // -------------------------------------------------------------------------
    // Post Actions
    // -------------------------------------------------------------------------
    post {
        always {
            echo '🧹 Cleaning up...'
            sh """
                docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true
                docker rmi ${DOCKER_IMAGE}:${GIT_COMMIT_SHORT} || true
            """
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully!'
            // Uncomment to enable Slack notifications
            // slackSend(
            //     color: 'good',
            //     message: "SUCCESS: ${APP_NAME} build #${BUILD_NUMBER} deployed successfully"
            // )
        }
        failure {
            echo '❌ Pipeline failed!'
            // Uncomment to enable Slack notifications
            // slackSend(
            //     color: 'danger',
            //     message: "FAILURE: ${APP_NAME} build #${BUILD_NUMBER} failed"
            // )
        }
    }
}
