task :default => ['blogs:create']

namespace :blog do
  desc "Create a Blank Blog Post (Run in the root of your blog directory)"
  task :create do
    Dir.chdir Rake.application.original_dir
    if !Dir.exists? '_posts'
      STDOUT.puts 'The "_posts" directory was not found, are you in your blog root directory?'
      return
    end

    # Front Yaml Container
    yaml_data = {}

    # File type
    file_extension = '.markdown'

    # Ask the user if .markdown is ok
    STDOUT.puts "\nThe default blog type is markdown, if yes press enter otherwise enter a different extension (i.e. html):"
    new_extension = STDIN.gets.strip
    file_extension = '.' + new_extension if new_extension.length > 1

    # Standard Blog Layout
    yaml_data['layout'] = 'blogs'

    # Begin Interracting with the blog creator
    STDOUT.puts "\nAll of the collected data can be changed by editting the YAML at the top of your generated post."

    # Query for Title
    STDOUT.puts "\nPlease enter the TITLE for your new blog post:"
    yaml_data['title'] = STDIN.gets.strip

    # Query For Tags
    STDOUT.puts "\nPlease enter the relevant TAGS (space delimited) for your new blog post:"
    yaml_data['tags'] = STDIN.gets.strip.downcase

    #Get the current
    yaml_data['date'] = Time.now.to_s

    # Create Full blog title
    blog_date_title = [Time.now.year.to_s, Time.now.month.to_s, Time.now.day.to_s].join '-'

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
  end

  desc "Create a new user's blog directory structure (Run in the root of the repository)"
  task :directory do
    # Grab their first name
    STDOUT.puts "\nPlease enter your first name:"
    first_name = STDIN.gets.strip

    # Grab their last name
    STDOUT.puts "\nPlease enter your last name:"
    last_name = STDIN.gets.strip

    #Create and cd to your folder
    folder_name = first_name.downcase + '_' + last_name.downcase
    Dir.mkdir folder_name
    Dir.chdir folder_name

    #Create the posts and assets folders
    Dir.mkdir '_posts'
    Dir.mkdir 'assets'

    # Index page information
    index_info = {
      'layout' => 'person',
      'name' => first_name + ' ' + last_name,
      'user' => folder_name,
    }

    #Create the shell index folder
    # Open the blog file and write the data to the file
    File.open('index.html', 'w') do |bio_page|  
      bio_page.puts '---'
      index_info.each do |key, value|
        bio_page.puts key + ': ' + value
      end
      bio_page.puts 'social:'
      bio_page.puts "\t twitter: (Your twitter url)"
      bio_page.puts '---'
      bio_page.puts '(Insert Bio Information)' 
    end
  end
end