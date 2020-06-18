class Post < ApplicationRecord
  belongs_to :board
  belongs_to :user
  belongs_to :post_status, optional: true
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy

  has_many_attached :images
  validates :images, presence: true, allow_blank: true, blob: { content_type: ['image/png', 'image/jpg', 'image/jpeg'], size_range: 1..5.megabytes }

  attribute :urls

  validates :title, presence: true, length: { in: 4..64 }

  paginates_per Rails.application.posts_per_page

  def urls
    Post.fetch_urls(images)
  end

  def self.fetch_urls(images)
    ActiveStorage::Current.set(host: ENV["STORAGE_HOST"]) do
      images.map do |image|    
        Rails.cache.fetch(image.blob.key, expires_in: 1.week.seconds.to_i) do
          image.blob.service_url
        end
      end.reject(&:blank?)
    end
  end

  class << self
    def find_with_post_status_in(post_statuses)
      where(post_status_id: post_statuses.pluck(:id))
    end

    def search_by_name_or_description(s)
      s = s || ''
      s = sanitize_sql_like(s)
      where("posts.title ILIKE ? OR posts.description ILIKE ?", "%#{s}%", "%#{s}%")
    end
  end
end
