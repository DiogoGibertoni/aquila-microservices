# Modelo de Dados - Sistema Aquila

## Product Service (MongoDB Atlas)
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "category": "string",
  "external_id": "string",
  "site_id": "string",
  "created_at": "datetime"
}
```

## Price Service (Azure SQL Server)
```sql
CREATE TABLE prices (
    id INT PRIMARY KEY IDENTITY,
    product_id VARCHAR(255),
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    is_promotion BIT,
    is_fake_promotion BIT,
    scraped_at DATETIME
);
```