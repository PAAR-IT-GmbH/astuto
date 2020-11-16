class NewPostMailer < ApplicationMailer
    def operator(post)
        @post = post
        mail(to: Rails.application.email_operator, subject: "NewPost: " + post.title) do |format|
            format.text
        end
    end
end
