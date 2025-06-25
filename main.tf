# Configure Azure provider
provider "azurerm" {
  subscription_id = "0353fb11-0615-4117-8bc8-93f5833a0dd3"
  features {}
}

# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "photoappRG"
  location = "centralindia"
}

# Azure Container Registry (ACR)
resource "azurerm_container_registry" "acr" {
  name                = "myphotoappacr"   
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Azure Kubernetes Service (AKS)
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "myphotoapp-aks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "myaksdns"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_B2ms"  # ✅ updated
  }

  identity {
    type = "SystemAssigned"
  }
}
# Azure Storage Account
resource "azurerm_storage_account" "storage" {
  name                     = "photostorageacct"   
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Azure Blob Container
resource "azurerm_storage_container" "container" {
  name                  = "myphotocontainer"
  storage_account_id    = azurerm_storage_account.storage.id   
  container_access_type = "private"
}
# Azure PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "pgsql" {
  name                   = "photoappdb2025"   
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  version                = "14"
  administrator_login    = "pgadmin"
  administrator_password = "MyPhotoApp2025!"

  sku_name   = "B_Standard_B1ms" # ✅ a valid SKU in most regions
  storage_mb = 32768
}