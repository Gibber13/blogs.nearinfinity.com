task :default => ['blog:create']

namespace :blog do
  desc "Create a Blank Blog Post (Run in your personal blog folder)"
  task :create do
    Dir.chdir Rake.application.original_dir
    if !Dir.exists? '_posts'
      STDOUT.puts 'The "_posts" directory was not found, are you in your personal blog folder?'
      return
    end

    # Front Yaml Container
    yaml_data = {}

    # File type
    file_extension = '.markdown'

    # Ask the user if .markdown is ok
    STDOUT.puts "\nThe default blog type is markdown. If you want to blog in markdown press enter, otherwise enter a different extension (i.e. html):"
    new_extension = STDIN.gets.strip
    file_extension = '.' + new_extension if new_extension.length > 1

    STDOUT.puts "\nAll of the following collected data can be changed by editting the YAML at the top of your generated post."

    # Query for Title
    STDOUT.puts "\nPlease enter the TITLE for your new blog post:"
    raw_title = STDIN.gets.strip
    raw_title = '"' + raw_title + '"' if raw_title.include? ':'
    yaml_data['title'] = raw_title

    # Query For Tags
    STDOUT.puts "\nPlease enter the relevant TAGS (space delimited) for your new blog post:"
    yaml_data['tags'] = STDIN.gets.strip.downcase

    # Create date portion of title
    blog_date_title = ["%02d" % Time.now.year, "%02d" % Time.now.month, "%02d" % Time.now.day].join '-'

    # Shorten the title to soemthing readable in the url (do not cut off mid word)
    blog_end_title = ''
    title_words = yaml_data['title'].downcase.split(' ')
    title_words.each_with_index do |word, index|
      blog_end_title += word
      break if blog_end_title.length >= 60
      blog_end_title += '-' if index < title_words.count - 1
    end

    # Full blog title
    full_title = blog_date_title + '-' + blog_end_title + file_extension

    # Open the blog file and write the data to the file
    File.open('_posts/' + full_title, 'w') do |blog_post|  
      blog_post.puts '---'
      yaml_data.each do |key, value|
        blog_post.puts key + ': ' + value
      end
      blog_post.puts '---'
      blog_post.puts '(Insert Blog Content)' 
    end

    STDOUT.puts "\nGenerated blog post #{raw_title} at _posts/#{full_title}"
  end

  desc "Create a new user's blog directory structure (Run in the root of the repository)"
  task :directory, :full_name do |t, args|
    unless args[:full_name]
      STDOUT.puts "\nPlease enter your full name:"
      full_name = STDIN.gets.strip
    else
      full_name = args[:full_name]
    end

    #Create and cd to your folder
    folder_name = full_name.gsub(/\s+/, '_').gsub(/'/, '').downcase
    Dir.mkdir folder_name
    Dir.chdir folder_name

    #Create the posts and assets folders
    # Add .gitignore so that the folders are versioned
    Dir.mkdir '_posts'
    File.open '_posts/.gitignore', 'w'
    Dir.mkdir 'assets'
    File.open 'assets/.gitignore', 'w'

    # Index page information
    index_info = {
      'title' => '',
      'areas_of_interest' => '',
      'employment_date' => '',
      'alma_mater' => '',
      'nic_sports' => ''
    }

    #Create the shell index folder
    # Open the blog file and write the data to the file
    File.open('index.html', 'w') do |bio_page|  
      bio_page.puts '---'
      bio_page.puts '# Name: How you want your name to be displayed on your Bio Page'
      bio_page.puts "name: #{full_name}"
      bio_page.puts '# User_info: Assorted information about yourself (Any added fields will not be displayed)'
      bio_page.puts 'user_info:'
      index_info.each do |key, value|
        bio_page.puts '  ' + key + ': ' + value
      end
      bio_page.puts 'social:'
      bio_page.puts "  # Include your social pages, for example:"
      bio_page.puts "  # name of service (i.e. twitter) => your service url (http://www.twitter.com/jharwig)"
      bio_page.puts "  # twitter: http://www.twitter.com/jharwig"
      bio_page.puts "  # For a working example check out Jason's bio page (jason_harwig/index.html)"
      bio_page.puts "# Long Bio Below the lines (as html)"
      bio_page.puts '---'
      bio_page.puts '(Insert Bio Information)' 
    end
    
    STDOUT.puts "\nGenerated directory #{folder_name}/. Please edit the index file in your directory."
  end
end
