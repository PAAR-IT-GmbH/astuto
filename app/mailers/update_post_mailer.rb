class UpdatePostMailer < ApplicationMailer
    def operator(post)

        comments = Comment.select('users.email as email')
            .where(post_id: post.id)
            .left_outer_joins(:user)

        likes = Like
            .select(
              :email
            )
            .left_outer_joins(:user)
            .where(post_id: post.id)

        @post = post
        mail(bcc: ([Rails.application.email_operator] + comments.map{ |c| c.email } + likes.map{ |c| c.email }), subject:  I18n.t('email.post.subject', title: post.title)) do |format|
            format.text
        end
    end
end
