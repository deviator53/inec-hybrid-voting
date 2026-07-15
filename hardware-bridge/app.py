"""
INEC Hardware Bridge Microservice
Simulates USB peripherals: Fingerprint scanner, Thermal printer, Camera
Academic Thesis Implementation - Flask REST API
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import hashlib
import time
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Hardware status tracking
hardware_status = {
    'biometric_scanner': {
        'connected': True,
        'model': 'SecuGen Hamster Pro - Suprema BioStation A2',
        'status': 'CONNECTED'
    },
    'thermal_printer': {
        'connected': True,
        'model': 'BOCA TM-T88V - Epson TM-T88V - 80mm',
        'status': 'CONNECTED'
    },
    'blockchain_node': {
        'connected': True,
        'model': 'Node://127.0.0.1:8545 - Hyperledger Besu',
        'height': 842109,
        'status': 'SYNCED'
    }
}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'operational',
        'timestamp': datetime.now().isoformat(),
        'service': 'INEC Hardware Bridge v2.1.4'
    })

@app.route('/api/hardware/status', methods=['GET'])
def get_hardware_status():
    """Return status of all connected peripherals"""
    return jsonify({
        'success': True,
        'hardware': hardware_status,
        'allSystemsNominal': all(h['connected'] for h in hardware_status.values())
    })

@app.route('/api/biometric/fingerprint/scan', methods=['POST'])
def scan_fingerprint():
    """Simulate fingerprint capture"""
    time.sleep(1.2)  # Simulate scan duration
    
    # Generate mock fingerprint hash
    fingerprint_data = f"FP_{random.randint(100000, 999999)}_{time.time()}"
    fingerprint_hash = hashlib.sha256(fingerprint_data.encode()).hexdigest()
    
    return jsonify({
        'success': True,
        'fingerprintHash': fingerprint_hash,
        'quality': random.randint(85, 98),
        'timestamp': datetime.now().isoformat(),
        'status': 'CAPTURED'
    })

@app.route('/api/biometric/face/capture', methods=['POST'])
def capture_face():
    """Simulate facial recognition capture"""
    time.sleep(1.5)  # Simulate capture duration
    
    # Generate mock face hash
    face_data = f"FACE_{random.randint(100000, 999999)}_{time.time()}"
    face_hash = hashlib.sha256(face_data.encode()).hexdigest()
    
    return jsonify({
        'success': True,
        'faceHash': face_hash,
        'confidence': random.uniform(92.0, 99.5),
        'timestamp': datetime.now().isoformat(),
        'status': 'CAPTURED'
    })

@app.route('/api/printer/print-receipt', methods=['POST'])
def print_receipt():
    """Simulate VVPAT thermal receipt printing"""
    data = request.json
    transaction_hash = data.get('transactionHash', 'N/A')
    candidate = data.get('candidate', 'Unknown')
    party = data.get('party', 'N/A')
    block_number = data.get('blockNumber', 'N/A')
    
    time.sleep(2.0)  # Simulate printing duration
    
    print(f"""
    ═══════════════════════════════════════
         FEDERAL REPUBLIC OF NIGERIA
    INDEPENDENT NATIONAL ELECTORAL COMMISSION
           VOTER VERIFIED PAPER AUDIT TRAIL
    ═══════════════════════════════════════
    
    ELECTION: GUBERNATORIAL 2026
    DATE: 04/12/08/2001
    
    YOUR VOTE HAS BEEN CAST FOR:
    
    CANDIDATE: {candidate}
    PARTY: {party}
    
    ───────────────────────────────────────
    BLOCKCHAIN VERIFICATION
    ───────────────────────────────────────
    TX HASH: {transaction_hash[:20]}...
    BLOCK: #{block_number}
    TIME: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    
    ───────────────────────────────────────
    This receipt confirms your vote was
    securely recorded on the blockchain.
    Thank you for participating in
    Nigeria's democratic process.
    ───────────────────────────────────────
    
    NEVS v2.1.4 • ISSUED: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}
    ═══════════════════════════════════════
    """)
    
    return jsonify({
        'success': True,
        'printed': True,
        'timestamp': datetime.now().isoformat(),
        'status': 'RECEIPT_PRINTED'
    })

@app.route('/api/blockchain/sync-status', methods=['GET'])
def blockchain_sync():
    """Return blockchain node synchronization status"""
    hardware_status['blockchain_node']['height'] += random.randint(0, 3)
    
    return jsonify({
        'success': True,
        'synced': True,
        'blockHeight': hardware_status['blockchain_node']['height'],
        'peers': random.randint(12, 18),
        'avgBlockTime': round(random.uniform(12.0, 15.5), 2)
    })

if __name__ == '__main__':
    print("🔧 INEC Hardware Bridge Starting...")
    print("📡 Biometric Scanner: CONNECTED")
    print("🖨️  Thermal Printer: CONNECTED")
    print("⛓️  Blockchain Node: SYNCED")
    app.run(host='0.0.0.0', port=5050, debug=True)
