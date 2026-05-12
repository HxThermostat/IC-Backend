resource "aws_iam_user" "heroku-dyno" {
  name = "heroku-dyno"
  path = "/system/"
}

resource "aws_iam_access_key" "heroku-dyno" {
  user = aws_iam_user.heroku-dyno.name
}

resource "aws_iam_user_policy" "heroku-dyno-policy" {
  name = "heroku-dyno"
  user = aws_iam_user.heroku-dyno.name

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowPublishingMessages",
            "Effect": "Allow",
            "Action": "sns:Publish",
            "Resource": "*"
        },
        {
            "Sid": "AllowManagingUserTopics",
            "Effect": "Allow",
            "Action": [
                "sns:Unsubscribe",
                "sns:Subscribe",
                "sns:SetEndpointAttributes",
                "sns:ListSubscriptionsByTopic",
                "sns:GetEndpointAttributes",
                "sns:CreateTopic",
                "sns:CreatePlatformEndpoint"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

output "heroku-dyno-id" {
  value = aws_iam_access_key.heroku-dyno.id
}

output "heroku-dyno-secret" {
  value = aws_iam_access_key.heroku-dyno.secret
}

locals {
  apns_certificate = file("./apns-certificate")
  apns_key = file("./apns-key")
  fcm_key = file("./fcm-key")
}

resource "aws_sns_platform_application" "apns_application" {
  name = "PushIOS"
  platform = "APNS"
  platform_principal = local.apns_certificate
  platform_credential = local.apns_key
}

output "push_ios_arn" {
  value = aws_sns_platform_application.apns_application.arn
}

resource "aws_sns_platform_application" "gcm_application" {
  name = "PushAndroid"
  platform = "GCM"
  platform_credential = local.fcm_key
}

output "push_android_arn" {
  value = aws_sns_platform_application.gcm_application.arn
}