require 'json'
require 'fileutils'

# Create _data folder if it doesn't exist
data_folder = '_data'
Dir.mkdir(data_folder) unless File.exists?(data_folder)

last_commits = {}
`git ls-files -- '*.md'`.each_line do |file|
  file.chomp!
  commit_date = `git log -1 --format='%ad' --date=iso -- "#{file}"`.chomp
  last_commits[file] = commit_date
end

File.write(File.join(data_folder, 'commit_dates.json'), JSON.pretty_generate(last_commits))
