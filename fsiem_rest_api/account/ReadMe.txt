back_end.py是處理網站request與response的程式
def sendjs()是處理request，要求資料庫所求資料，並索求回傳的程式

index.html網站程式碼

delete_data用於刪除資料庫資料的程式，基本上用於排程，定期處理資料

account_manage 用於管理資料庫的各種資料，例如:新增欄位、刪除欄位等等

findip 用於找尋資料庫是否有匹配的ip，若無則回傳unknown