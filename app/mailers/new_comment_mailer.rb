class NewCommentMailer < ApplicationMailer
    def operator(comment)
        post = Post.find(comment.post_id)

        comments = Comment.select('users.email as email')
            .where(post_id: comment.post_id)
            .left_outer_joins(:user)

        likes = Like
            .select(
              :email
            )
            .left_outer_joins(:user)
            .where(post_id: comment.post_id)

        @comment = comment
        mail(bcc: ([Rails.application.email_operator] + comments.map{ |c| c.email } + likes.map{ |c| c.email }).uniq, subject: I18n.t('email.comment.subject', title: post.title)) do |format|
            format.text
        end
    end
end
