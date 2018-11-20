#!/usr/bin/groovy
pipeline {
    agent { label 'jenkins-slave-npm' }

    environment {
        CI_CD_PROJECT = "labs-ci-cdryan"
        DEV_PROJECT = "labs-devryan"
        TEST_PROJECT = "labs-testryan"
        SOURCE_CONTEXT_DIR = ""
        BUILD_OUTPUT_CONTEXT_DIR = "public/"
        APP_NAME = "magicbox-maps"
        OCP_API_SERVER = "${OPENSHIFT_API_URL}"
        OCP_TOKEN = readFile('/var/run/secrets/kubernetes.io/serviceaccount/token').trim()
    }

    stages {
        stage('Build'){
            steps{
              sh "npm install && npm run build"
            }
        }

        stage('Bake'){
            steps{
                script{
                    patchBuildConfigOutputLabels(env)

                    openshift.withCluster () {
                        def buildSelector = openshift.startBuild( "${APP_NAME} --from-dir=${BUILD_OUTPUT_CONTEXT_DIR}" )
                        buildSelector.logs('-f')
                    }
                }
            }
        }

        stage('Deploy: Dev'){
            steps {
                script{
                    timeout(5) { // in minutes
                        openshift.loglevel(3)
                        promoteImageWithinCluster( "${APP_NAME}", "${CI_CD_PROJECT}", "${DEV_PROJECT}" )
                        verifyDeployment("${APP_NAME}", "${DEV_PROJECT}")
                    }
                }
            }
        }

        stage('Deploy: Test'){
            options {
                timeout(time: 1, unit: 'HOURS')
            }
            steps {
                script{
                    timeout(10) { // in minutes
                        promoteImageWithinCluster( "${APP_NAME}", "${DEV_PROJECT}", "${TEST_PROJECT}" )
                        verifyDeployment("${APP_NAME}", "${TEST_PROJECT}")
                    }
                }
            }
        }
    }
}
