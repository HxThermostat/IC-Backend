provider "aws" {
  region                  = "us-east-1"
  profile                 = "tfuser"
  shared_credentials_file = ".aws/credentials"
}

data "aws_region" "current" {}
