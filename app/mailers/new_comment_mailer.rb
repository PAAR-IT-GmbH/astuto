class NewCommentMailer < ApplicationMailer
    def operator(comment)
        @comment = comment
        mail(to: Rails.application.email_operator, subject: "NewComment") do |format|
            format.text
        end
    end
end
