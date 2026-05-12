terraform {
  required_version = ">= 0.12"

  backend "s3" {
    bucket                  = "com-kraftful-intellicomfort-terraform"
    key                     = "terraform.tfstate"
    region                  = "us-east-1"
    profile                 = "tfuser"
    shared_credentials_file = ".aws/credentials"
  }
}
