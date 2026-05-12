#!/usr/bin/env ruby
# based off https://gist.github.com/fleveque/816dba802527eada56ab
require 'rubygems'
require "aws-sdk-cloudfront"

class S3FolderUploader
  attr_reader :folder_path, :total_files, :s3_bucket, :version
  attr_accessor :files

  # Initialize the upload class
  #
  # folder_path - path to the folder that you want to upload
  # version - the version to upload

  def initialize(folder_path, version)
    Aws.config.update({
      region: ENV['AWS_REGION'],
      credentials: Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'])
    })

    @folder_path       = folder_path
    @root_folder       = 'update'
    @version           = version
    @files             = Dir.glob("#{folder_path}/**/*")
    @total_files       = files.length
    @connection        = Aws::S3::Resource.new
    @s3_bucket         = @connection.bucket(ENV['AWS_BUCKET'])
  end

  # public: Upload files from the folder to S3
  #
  # thread_count - How many threads you want to use (defaults to 5)
  # simulate - Don't perform upload, just simulate it (default: false)
  # verbose - Verbose info (default: false) 
  
  # Returns true when finished the process
  def upload!(thread_count = 5, simulate = false, verbose = true)
    file_number = 0
    mutex       = Mutex.new
    threads     = []

    thread_count.times do |i|
      threads[i] = Thread.new {
        until files.empty?
          mutex.synchronize do
            file_number += 1
            Thread.current["file_number"] = file_number
          end
          file = files.pop rescue nil
          next unless file
          next if file.include?(".html")

          # Define destination path
          path = "#{@root_folder}/#{@version}/#{file.sub(/^#{folder_path}\//, '')}"
          p path
          puts "[#{Thread.current["file_number"]}/#{total_files}] uploading..." if verbose

          data = File.open(file)
          unless File.directory?  (data) || simulate
            obj = s3_bucket.object(path)
            options = { body: data }
            options.merge!({ content_type: "application/javascript" }) if file.include?('.js')
            obj.put(options)
          end
          data.close
        end
      }
    end
    threads.each { |t| t.join }
    purge_cloudfront!
  end

  def purge_cloudfront!
    cf_client = Aws::CloudFront::Client.new
    cf_client.create_invalidation({
      distribution_id: ENV['AWS_DISTRIBUTION_ID'],
      invalidation_batch: {
        paths: {
          quantity: 2,
          items: [
            "/#{@root_folder}/#{@version}/android-index.json",
            "/#{@root_folder}/#{@version}/ios-index.json"
          ],
        },
        caller_reference: Time.now.to_i.to_s,
      },
    })
  end
end
