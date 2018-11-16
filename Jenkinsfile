#!/usr/bin/groovy
pipeline {
    agent { label 'jenkins-slave-npm' }

    environment {
        CI_CD_PROJECT = "coo-ci-cd"
        DEV_PROJECT = "coo-dev"
        TEST_PROJECT = "coo-test"
        SOURCE_CONTEXT_DIR = ""
        BUILD_OUTPUT_CONTEXT_DIR = "dist/"
        APP_NAME = "vue-booster"
        OCP_API_SERVER = "${OPENSHIFT_API_URL}"
        OCP_TOKEN = readFile('/var/run/secrets/kubernetes.io/serviceaccount/token').trim()

    }

    stages {
        stage('Build'){
            steps{
              slackSend "${APP_NAME} Job Started - ${JOB_NAME} ${BUILD_NUMBER} (<${BUILD_URL}|Open>)"
              sh "npm install && ./node_modules/@vue/cli-service/bin/vue-cli-service.js build"
            }
        }

        stage('Bake'){
            steps{
                script{
                    def helper = load 'shared-library.groovy'
                    helper.patchBuildConfigOutputLabels(env)

                    openshift.withCluster () {
                        def buildSelector = openshift.startBuild( "${APP_NAME} --from-dir=${BUILD_OUTPUT_CONTEXT_DIR}" )
                        buildSelector.logs('-f')
                    }
                }
            }
        }

        stage('Deploy: Dev'){
            // Temporarily disabling features that require jenkins-slave-ansible
            // until issues with that container are resolved.
            // agent { label 'jenkins-slave-ansible'}
            steps {
                script{
                    def helper = load 'shared-library.groovy'
                    // helper.applyAnsibleInventory( 'dev' )
                    timeout(5) { // in minutes
                        openshift.loglevel(3)
                        helper.promoteImageWithinCluster( "${APP_NAME}", "${CI_CD_PROJECT}", "${DEV_PROJECT}" )
                        helper.verifyDeployment("${APP_NAME}", "${DEV_PROJECT}")
                    }
                }
            }
        }

        stage('Deploy: Test'){
            // agent { label 'jenkins-slave-ansible'}
            options {
                timeout(time: 1, unit: 'HOURS')
            }
            steps {
                script {
                    slackSend "${env.APP_NAME} Input requested - ${JOB_NAME} ${BUILD_NUMBER} (<${BUILD_URL}|Open>)"
                    input message: 'Deploy to Test?'
                }
                script{
                    def helper = load 'shared-library.groovy'
                    // helper.applyAnsibleInventory( 'test' )
                    timeout(10) { // in minutes
                        helper.promoteImageWithinCluster( "${APP_NAME}", "${DEV_PROJECT}", "${TEST_PROJECT}" )
                        // the new client is having random failures
                        helper.verifyDeployment("${APP_NAME}", "${TEST_PROJECT}")
                    }
                }

                slackSend color: "good", message: ":success: ${APP_NAME} Build Completed - ${JOB_NAME} ${BUILD_NUMBER} (<${BUILD_URL}|Open>)"

            }
        }
    }
}
