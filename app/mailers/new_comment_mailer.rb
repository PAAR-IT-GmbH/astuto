class NewCommentMailer < ApplicationMailer
    def operator(comment)
        post = Post.find(comment.post_id)
        @comment = comment
        mail(to: Rails.application.email_operator, subject: "NewComment: " + post.title) do |format|
            format.text
        end
    end
end
