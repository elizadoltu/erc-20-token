import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@components/Common/Card';
import { Button } from '@components/Common/Button';
import { Input } from '@components/Common/Input';
import { Modal } from '@components/Common/Modal';
import { useIsTokenOwner } from '@hooks/useIsOwner';
import { parseTokenAmount } from '@utils/format';
import { CheckCircle } from 'lucide-react';

// This is a simplified version - in production, you'd deploy contracts via ethers.js
const CreateCampaign = () => {
  const navigate = useNavigate();
  const { isOwner } = useIsTokenOwner();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [fundingGoal, setFundingGoal] = useState('');
  const [sponsorPercentage, setSponsorPercentage] = useState('10');
  const [shareholders, setShareholders] = useState<Array<{ address: string; percentage: string }>>([
    { address: '', percentage: '' },
  ]);

  const handleAddShareholder = () => {
    setShareholders([...shareholders, { address: '', percentage: '' }]);
  };

  const handleRemoveShareholder = (index: number) => {
    setShareholders(shareholders.filter((_, i) => i !== index));
  };

  const handleShareholderChange = (index: number, field: 'address' | 'percentage', value: string) => {
    const updated = [...shareholders];
    updated[index][field] = value;
    setShareholders(updated);
  };

  const totalPercentage = shareholders.reduce((sum, sh) => sum + (parseFloat(sh.percentage) || 0), 0);

  const handleDeploy = () => {
    // In production, this would deploy contracts using ethers.js ContractFactory
    // For now, show success modal
    setShowSuccess(true);
  };

  if (!isOwner) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Owner Only</h2>
          <p className="text-gray-600">Only the contract owner can create new campaigns</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold gradient-text mb-2">Create Campaign</h1>
      <p className="text-gray-600 mb-8">Deploy a new crowdfunding campaign</p>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
            {s < 4 && <div className={`w-16 h-1 ${s < step ? 'bg-primary-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
          <div className="space-y-4">
            <Input
              label="Funding Goal (in tokens)"
              type="number"
              placeholder="10000"
              value={fundingGoal}
              onChange={(e) => setFundingGoal(e.target.value)}
              helperText="Target amount to raise"
            />
            <Button onClick={() => setStep(2)} disabled={!fundingGoal}>
              Next
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Sponsorship */}
      {step === 2 && (
        <Card>
          <h2 className="text-2xl font-bold mb-6">Sponsorship Setup</h2>
          <div className="space-y-4">
            <Input
              label="Sponsor Percentage"
              type="number"
              min="0"
              max="100"
              placeholder="10"
              value={sponsorPercentage}
              onChange={(e) => setSponsorPercentage(e.target.value)}
              helperText="Percentage of funding goal to add as sponsorship"
            />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!sponsorPercentage}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Distribution */}
      {step === 3 && (
        <Card>
          <h2 className="text-2xl font-bold mb-6">Distribution Setup</h2>
          <div className="space-y-4">
            {shareholders.map((sh, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="0x..."
                  value={sh.address}
                  onChange={(e) => handleShareholderChange(index, 'address', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="%"
                  value={sh.percentage}
                  onChange={(e) => handleShareholderChange(index, 'percentage', e.target.value)}
                  className="w-24"
                />
                {shareholders.length > 1 && (
                  <Button variant="secondary" onClick={() => handleRemoveShareholder(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={handleAddShareholder}>
              + Add Shareholder
            </Button>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Percentage: {totalPercentage}%</p>
              {totalPercentage > 100 && (
                <p className="text-sm text-red-600">Total cannot exceed 100%</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)} disabled={totalPercentage > 100}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <Card>
          <h2 className="text-2xl font-bold mb-6">Review & Deploy</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Summary</h3>
              <p>Funding Goal: {fundingGoal} tokens</p>
              <p>Sponsor Percentage: {sponsorPercentage}%</p>
              <p>Shareholders: {shareholders.length}</p>
              <p>Total Percentage Allocated: {totalPercentage}%</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                ⚠️ Note: In production, this would deploy new contracts. This demo shows the UI flow.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={handleDeploy}>
                Deploy Campaign
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate('/campaigns');
        }}
        title="Campaign Created!"
      >
        <div className="text-center py-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700">
            Your campaign has been created successfully!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Add the campaign address to your list to track it.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default CreateCampaign;

