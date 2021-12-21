class Contact < ApplicationRecord
    enum subject: { バグや問題報告: 0, 機能追加リクエスト: 1, その他: 2}
    validates :subject, presence: true
    validates :message, presence: true
end
