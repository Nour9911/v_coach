pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']], // Adjust the branch name if necessary
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    submoduleCfg: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Nour9911/v_coach.git',
                        credentialsId: 'home_lab_devops_token'
                    ]]
                ])
            }
        }
    }
}