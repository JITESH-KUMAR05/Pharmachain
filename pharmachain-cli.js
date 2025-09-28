#!/usr/bin/env node

// Consumer & Manufacturer CLI with Real Midnight Blockchain Integration
import PharmaChainReal from './pharmachain-real.js';

console.log('💊 PharmaChain - Real Blockchain Drug Verification System');
console.log('🔗 Powered by Midnight Network with Zero-Knowledge Proofs');
console.log('='.repeat(70));

const args = process.argv.slice(2);
const pharmaChain = new PharmaChainReal();

if (args.length === 0) {
    showHelp();
    process.exit(0);
}

const command = args[0];

async function main() {
    try {
        // Initialize real Midnight connection
        console.log('🔄 Initializing connection to Midnight Network...');
        const initialized = await pharmaChain.initialize();
        
        if (!initialized) {
            console.log('⚠️ Running in offline mode with fallback verification');
        }
        
        switch (command) {
            case 'verify':
                await verifyForConsumer(args[1]);
                break;
            case 'register':
                await registerForManufacturer(args[1]);
                break;
            case 'demo-consumer':
                await runConsumerDemo();
                break;
            case 'demo-manufacturer':
                await runManufacturerDemo();
                break;
            case 'test-real-fda':
                await testRealFDAIntegration();
                break;
            default:
                console.log(`❌ Unknown command: ${command}`);
                showHelp();
        }
    } catch (error) {
        console.error('❌ Application error:', error.message);
        process.exit(1);
    }
}

// CONSUMER: Verify any drug batch with real APIs
async function verifyForConsumer(batchId) {
    if (!batchId) {
        console.log('❌ Please provide a batch ID to verify');
        console.log('Example: node pharmachain-cli.js verify "68180-518-01"');
        return;
    }
    
    console.log('\n👤 CONSUMER MODE: Drug Verification');
    const result = await pharmaChain.verifyDrugForConsumer(batchId);
    
    // Additional consumer guidance
    if (result.safe) {
        console.log('\n💡 Consumer Tips:');
        console.log('   ✅ Check expiration date on packaging');
        console.log('   ✅ Verify packaging integrity'); 
        console.log('   ✅ Store according to label instructions');
    } else {
        console.log('\n🚨 Consumer Warning:');
        console.log('   ❌ Do not consume this medication');
        console.log('   ❌ Report to pharmacist or FDA');
        console.log('   ❌ Contact poison control if already consumed: 1-800-222-1222');
    }
}

// MANUFACTURER: Register new drug batch
async function registerForManufacturer(batchData) {
    if (!batchData) {
        console.log('❌ Please provide batch registration data');
        console.log('Example: node pharmachain-cli.js register \'{"batchId":"68180-518-01","drugName":"Aspirin","manufacturer":"Pfizer","ndcCode":"68180-518-01","manufacturingDate":"2025-01-15","expiryDate":"2027-01-15"}\'');
        return;
    }
    
    try {
        const batchInfo = JSON.parse(batchData);
        console.log('\n🏭 MANUFACTURER MODE: Batch Registration');
        const result = await pharmaChain.registerBatchForManufacturer(batchInfo);
        
        if (result.success) {
            console.log('\n✅ Registration Complete - Benefits:');
            console.log('   🔒 Manufacturing secrets kept private with ZK proofs');
            console.log('   🌐 Global verification enabled for consumers');
            console.log('   📊 Supply chain transparency without revealing trade data');
            console.log('   ⚡ Instant counterfeit detection');
        }
    } catch (error) {
        console.log('❌ Invalid JSON format. Please provide valid batch data.');
        console.log('Required fields: batchId, drugName, manufacturer, ndcCode, manufacturingDate, expiryDate');
    }
}

// Demo scenarios for consumers
async function runConsumerDemo() {
    console.log('\n👤 CONSUMER DEMO: Testing with real and fake drugs\n');
    
    const testCases = [
        {
            name: 'Legitimate Pfizer Aspirin',
            batchId: '68180-518-01',
            description: 'Real NDC code from Pfizer'
        },
        {
            name: 'Legitimate Johnson & Johnson Product',
            batchId: '50458-220-10',
            description: 'Real NDC from J&J'
        },
        {
            name: 'Suspicious Counterfeit Drug',
            batchId: 'FAKE_COUNTERFEIT_001',
            description: 'Obviously fake batch ID'
        },
        {
            name: 'Unknown/Unregistered Drug',
            batchId: '99999-999-99',
            description: 'Not in FDA database'
        }
    ];
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n📋 Test ${i + 1}/4: ${testCase.name}`);
        console.log(`Description: ${testCase.description}`);
        console.log('-'.repeat(50));
        
        await pharmaChain.verifyDrugForConsumer(testCase.batchId);
        
        if (i < testCases.length - 1) {
            console.log('\n⏳ Moving to next test in 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('\n🎯 Consumer Demo Complete!');
    console.log('Key Takeaways:');
    console.log('✅ Real FDA database integration catches unregistered drugs');
    console.log('✅ Blockchain verification adds authenticity layer');  
    console.log('✅ AI pattern recognition detects suspicious batch IDs');
    console.log('✅ Combined scoring gives clear safety guidance');
}

// Demo scenarios for manufacturers  
async function runManufacturerDemo() {
    console.log('\n🏭 MANUFACTURER DEMO: Registering drug batches on blockchain\n');
    
    const sampleBatches = [
        {
            batchId: 'PFIZER-ASP-2025-001',
            drugName: 'Aspirin 325mg',
            manufacturer: 'Pfizer Inc',
            ndcCode: '68180-518-01',
            manufacturingDate: '2025-01-15',
            expiryDate: '2027-01-15',
            qualityScore: 98
        },
        {
            batchId: 'JNJ-TYLENOL-2025-045', 
            drugName: 'Tylenol Extra Strength',
            manufacturer: 'Johnson & Johnson',
            ndcCode: '50458-220-10',
            manufacturingDate: '2025-02-01',
            expiryDate: '2027-02-01',
            qualityScore: 97
        }
    ];
    
    for (let i = 0; i < sampleBatches.length; i++) {
        const batch = sampleBatches[i];
        console.log(`\n📦 Registering Batch ${i + 1}/2: ${batch.batchId}`);
        console.log('-'.repeat(50));
        
        const result = await pharmaChain.registerBatchForManufacturer(batch);
        
        if (result.success) {
            console.log(`\n✅ Now testing consumer verification of registered batch...`);
            await pharmaChain.verifyDrugForConsumer(batch.batchId);
        }
        
        if (i < sampleBatches.length - 1) {
            console.log('\n⏳ Preparing next batch registration...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('\n🎯 Manufacturer Demo Complete!');
    console.log('Key Benefits Demonstrated:');
    console.log('✅ Private manufacturing data protected with ZK proofs');
    console.log('✅ Instant global verification for consumers');
    console.log('✅ Counterfeit prevention without revealing trade secrets');
    console.log('✅ Supply chain transparency with privacy');
}

// Test real FDA API integration
async function testRealFDAIntegration() {
    console.log('\n🇺🇸 TESTING REAL FDA API INTEGRATION\n');
    
    const realNDCCodes = [
        '68180-518-01', // Pfizer Aspirin 
        '50458-220-10', // J&J Product
        '00069-001-30', // Pfizer Viagra
        '00006-007-41', // Merck Product
        '99999-999-99'  // Invalid NDC
    ];
    
    console.log('🔍 Testing with real NDC codes from FDA database:');
    
    for (const ndcCode of realNDCCodes) {
        console.log(`\n📋 Testing NDC: ${ndcCode}`);
        console.log('-'.repeat(40));
        
        try {
            const result = await pharmaChain.verifyWithFDADatabase(ndcCode);
            
            if (result.valid) {
                console.log('✅ FDA VERIFICATION: FOUND');
                console.log(`   Drug: ${result.drugName || 'N/A'}`);
                console.log(`   Manufacturer: ${result.manufacturer || 'N/A'}`);
                console.log(`   Confidence: ${Math.round(result.confidence * 100)}%`);
            } else {
                console.log('❌ FDA VERIFICATION: NOT FOUND');
                console.log(`   Reason: ${result.reason}`);
                console.log(`   Confidence: ${Math.round(result.confidence * 100)}%`);
            }
        } catch (error) {
            console.log(`⚠️ Error testing ${ndcCode}: ${error.message}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    }
    
    console.log('\n🎯 FDA Integration Test Complete!');
    console.log('This demonstrates real-time FDA database verification');
}

function showHelp() {
    console.log(`
👤 CONSUMER COMMANDS:
  verify <batch-id>               - Verify drug authenticity with real APIs
  demo-consumer                   - Run consumer demo with real/fake drugs
  
🏭 MANUFACTURER COMMANDS:  
  register <batch-json>           - Register drug batch on blockchain
  demo-manufacturer               - Run manufacturer registration demo
  
🧪 TESTING COMMANDS:
  test-real-fda                   - Test real FDA API integration
  
📚 EXAMPLES:
  # Consumer verifying a drug
  node pharmachain-cli.js verify "68180-518-01"
  
  # Manufacturer registering a batch  
  node pharmachain-cli.js register '{"batchId":"68180-518-01","drugName":"Aspirin","manufacturer":"Pfizer","ndcCode":"68180-518-01","manufacturingDate":"2025-01-15","expiryDate":"2027-01-15"}'
  
  # Run consumer demo
  node pharmachain-cli.js demo-consumer
  
  # Test real FDA integration
  node pharmachain-cli.js test-real-fda

🔗 REAL INTEGRATIONS:
  ✅ FDA NDC Database API
  ✅ Midnight Network Blockchain  
  ✅ Zero-Knowledge Proofs
  ✅ AI Pattern Recognition
  ✅ Consumer Safety Scoring
`);
}

// Run the application
main().catch(console.error);