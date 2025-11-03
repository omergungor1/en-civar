"""
Google Ads API ile Toplu IP Engelleme Script'i
Tüm kampanyalara IP listesini ekler
"""

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

class GoogleAdsIPBlocker:
    def __init__(self, credentials_path, customer_id):
        """
        Args:
            credentials_path: google-ads.yaml dosya yolu
            customer_id: Google Ads müşteri ID (tire olmadan, örn: 1234567890)
        """
        self.client = GoogleAdsClient.load_from_storage(credentials_path)
        self.customer_id = customer_id
    
    def get_all_campaigns(self):
        """Tüm aktif kampanyaları listeler"""
        ga_service = self.client.get_service("GoogleAdsService")
        
        query = """
            SELECT 
                campaign.id,
                campaign.name,
                campaign.status
            FROM campaign
            WHERE campaign.status IN ('ENABLED', 'PAUSED')
            ORDER BY campaign.name
        """
        
        response = ga_service.search(customer_id=self.customer_id, query=query)
        campaigns = []
        
        for row in response:
            campaigns.append({
                'id': row.campaign.id,
                'name': row.campaign.name,
                'status': row.campaign.status.name
            })
        
        return campaigns
    
    def add_ip_exclusions_to_campaign(self, campaign_id, ip_addresses):
        """
        Belirli bir kampanyaya IP engelleme listesi ekler
        
        Args:
            campaign_id: Kampanya ID
            ip_addresses: Engellenecek IP listesi (örn: ['1.2.3.4', '192.168.1.0/24'])
        
        Returns:
            dict: Başarılı ve başarısız IP'lerin listesi
        """
        campaign_criterion_service = self.client.get_service("CampaignCriterionService")
        
        operations = []
        
        for ip in ip_addresses:
            campaign_criterion_operation = self.client.get_type("CampaignCriterionOperation")
            campaign_criterion = campaign_criterion_operation.create
            
            # Kampanya resource name
            campaign_criterion.campaign = self.client.get_service(
                "CampaignService"
            ).campaign_path(self.customer_id, campaign_id)
            
            # IP Block criterion
            campaign_criterion.ip_block.ip_address = ip
            
            # Negatif olarak işaretle
            campaign_criterion.negative = True
            
            operations.append(campaign_criterion_operation)
        
        results = {
            'success': [],
            'failed': []
        }
        
        try:
            response = campaign_criterion_service.mutate_campaign_criteria(
                customer_id=self.customer_id,
                operations=operations
            )
            
            for result in response.results:
                results['success'].append(result.resource_name)
            
        except GoogleAdsException as ex:
            print(f"Hata oluştu: {ex}")
            for error in ex.failure.errors:
                results['failed'].append({
                    'error': error.message,
                    'trigger': error.trigger.string_value if error.trigger else None
                })
        
        return results
    
    def add_ips_to_all_campaigns(self, ip_addresses, exclude_campaign_ids=None):
        """
        Tüm kampanyalara IP engelleme listesi ekler
        
        Args:
            ip_addresses: Engellenecek IP listesi
            exclude_campaign_ids: Hariç tutulacak kampanya ID'leri (opsiyonel)
        
        Returns:
            dict: Kampanya bazında sonuçlar
        """
        if exclude_campaign_ids is None:
            exclude_campaign_ids = []
        
        campaigns = self.get_all_campaigns()
        all_results = {}
        
        print(f"Toplam {len(campaigns)} kampanya bulundu")
        print(f"Engellenecek IP sayısı: {len(ip_addresses)}\n")
        
        for campaign in campaigns:
            # Hariç tutulan kampanyaları atla
            if campaign['id'] in exclude_campaign_ids:
                print(f"ATLANDI: {campaign['name']} (ID: {campaign['id']})")
                continue
            
            print(f"İşleniyor: {campaign['name']} (ID: {campaign['id']})")
            
            results = self.add_ip_exclusions_to_campaign(
                campaign['id'], 
                ip_addresses
            )
            
            all_results[campaign['id']] = {
                'campaign_name': campaign['name'],
                'results': results
            }
            
            print(f"  ✓ Başarılı: {len(results['success'])}")
            print(f"  ✗ Başarısız: {len(results['failed'])}\n")
        
        return all_results
    
    def get_existing_ip_exclusions(self, campaign_id):
        """Kampanyada mevcut IP engellemelerini listeler"""
        ga_service = self.client.get_service("GoogleAdsService")
        
        query = f"""
            SELECT 
                campaign_criterion.criterion_id,
                campaign_criterion.ip_block.ip_address
            FROM campaign_criterion
            WHERE campaign_criterion.campaign = 'customers/{self.customer_id}/campaigns/{campaign_id}'
            AND campaign_criterion.type = 'IP_BLOCK'
            AND campaign_criterion.negative = TRUE
        """
        
        response = ga_service.search(customer_id=self.customer_id, query=query)
        
        ip_list = []
        for row in response:
            ip_list.append(row.campaign_criterion.ip_block.ip_address)
        
        return ip_list


# KULLANIM ÖRNEĞİ
if __name__ == "__main__":
    
    # Yapılandırma
    CREDENTIALS_PATH = "google-ads.yaml"  # OAuth2 credentials dosyanız
    CUSTOMER_ID = "1234567890"  # Tire olmadan müşteri ID
    
    # Engellenecek IP listesi
    IP_LIST = [
        "45.123.45.67",
        "192.168.1.100",
        "10.0.0.0/24",  # CIDR formatı da desteklenir
        "172.16.0.1"
    ]
    
    # Hariç tutulacak kampanyalar (opsiyonel)
    EXCLUDE_CAMPAIGNS = []  # Örn: [12345, 67890]
    
    # IP Blocker başlat
    blocker = GoogleAdsIPBlocker(CREDENTIALS_PATH, CUSTOMER_ID)
    
    # Örnek 1: Tüm kampanyaları listele
    print("=== KAMPANYA LİSTESİ ===")
    campaigns = blocker.get_all_campaigns()
    for camp in campaigns:
        print(f"{camp['name']} - ID: {camp['id']} - Status: {camp['status']}")
    
    print("\n" + "="*50 + "\n")
    
    # Örnek 2: Tek kampanyaya IP ekle
    # campaign_id = campaigns[0]['id']
    # result = blocker.add_ip_exclusions_to_campaign(campaign_id, IP_LIST)
    # print(f"Sonuç: {result}")
    
    # Örnek 3: Tüm kampanyalara IP ekle
    print("=== TÜM KAMPANYALARA IP EKLEME ===")
    results = blocker.add_ips_to_all_campaigns(IP_LIST, EXCLUDE_CAMPAIGNS)
    
    # Özet rapor
    print("\n=== ÖZET RAPOR ===")
    total_success = sum(len(r['results']['success']) for r in results.values())
    total_failed = sum(len(r['results']['failed']) for r in results.values())
    
    print(f"İşlenen kampanya sayısı: {len(results)}")
    print(f"Toplam başarılı ekleme: {total_success}")
    print(f"Toplam başarısız: {total_failed}")
    
    # Örnek 4: Mevcut IP engellemelerini kontrol et
    # existing_ips = blocker.get_existing_ip_exclusions(campaign_id)
    # print(f"Mevcut engellenmiş IP'ler: {existing_ips}")