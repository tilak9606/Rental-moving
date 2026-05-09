import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { moveInService } from '../../services/moveInService.js'
import { 
  FileText, Upload, PenTool, Package, CheckCircle, 
  ArrowLeft, Plus, X, Eye, AlertCircle, Check
} from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import toast from 'react-hot-toast'

const MoveInDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [moveIn, setMoveIn] = useState(null)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Document upload
  const [selectedFile, setSelectedFile] = useState(null)
  const [docType, setDocType] = useState('other')

  // Inventory form
  const [inventoryForm, setInventoryForm] = useState({
    itemName: '', category: '', preMoveInCondition: '', notes: ''
  })
  const [showInventoryForm, setShowInventoryForm] = useState(false)

  useEffect(() => {
    fetchMoveIn()
  }, [id])

  const fetchMoveIn = async () => {
    try {
      const { data } = await moveInService.getMyMoveIns()
      const found = data.find(m => m._id === id)
      if (found) {
        setMoveIn(found)
        fetchInventory()
        // Auto-switch to correct tab based on status
        if (found.status === 'pending') setActiveTab('documents')
        else if (found.status === 'documents_uploaded') setActiveTab('documents')
        else if (found.status === 'agreement_signed') setActiveTab('inventory')
      } else {
        toast.error('Move-in not found')
        navigate('/my-moveins')
      }
    } catch {
      toast.error('Failed to load move-in')
      navigate('/my-moveins')
    } finally {
      setLoading(false)
    }
  }

  const fetchInventory = async () => {
    try {
      const { data } = await moveInService.getInventoryItems(id)
      setInventory(data)
    } catch {
      setInventory([])
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }
    const formData = new FormData()
    formData.append('document', selectedFile)
    formData.append('docType', docType)

    try {
      await moveInService.uploadDocument(id, formData)
      toast.success('Document uploaded')
      setSelectedFile(null)
      fetchMoveIn()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    }
  }

  const handleSignAgreement = async () => {
    try {
      await moveInService.signAgreement(id)
      toast.success('Agreement signed! Now add inventory items.')
      fetchMoveIn()
      setActiveTab('inventory')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sign')
    }
  }

  const handleAddInventory = async (e) => {
    e.preventDefault()
    try {
      await moveInService.addInventoryItem(id, inventoryForm)
      toast.success('Item added! Add more or wait for landlord verification.')
      setInventoryForm({ itemName: '', category: '', preMoveInCondition: '', notes: '' })
      fetchInventory()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item')
    }
  }

  const handleVerify = async (itemId) => {
    try {
      await moveInService.verifyInventory(itemId, 'tenant')
      toast.success('Item verified by you')
      fetchInventory()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify')
    }
  }

  if (loading) return <LoadingSpinner />
  if (!moveIn) return null

  const statusOrder = ['pending', 'documents_uploaded', 'agreement_signed', 'inventory_checked', 'move_in_complete']
  const currentStep = statusOrder.indexOf(moveIn.status)

  // Determine what tenant should do next
  const getNextAction = () => {
    switch (moveIn.status) {
      case 'pending':
        return { text: 'Upload at least 3 documents', tab: 'documents', icon: Upload }
      case 'documents_uploaded':
        return { text: 'Sign the rental agreement', tab: 'documents', icon: PenTool }
      case 'agreement_signed':
        return { text: 'Add inventory items for verification', tab: 'inventory', icon: Package }
      case 'inventory_checked':
        return { text: 'Waiting for landlord to complete move-in', tab: 'overview', icon: CheckCircle }
      case 'move_in_complete':
        return { text: 'Move-in completed!', tab: 'overview', icon: CheckCircle }
      default:
        return { text: 'Unknown status', tab: 'overview', icon: AlertCircle }
    }
  }

  const nextAction = getNextAction()

  return (
    <div className="page-container">
      {/* Header */}
      <button onClick={() => navigate('/my-moveins')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-5 h-5" />
        Back to Move-ins
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">Move-in Details</h1>
          <p className="text-gray-500 mt-1">{moveIn.property?.title} — {moveIn.property?.city}</p>
        </div>
        <StatusBadge status={moveIn.status} />
      </div>

      {/* Next Action Banner */}
      <div className="card mb-6 bg-gradient-to-r from-rose-50 to-white border-rose-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
            <nextAction.icon className="w-6 h-6 text-rose-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Your next step:</p>
            <p className="font-semibold text-rose-700">{nextAction.text}</p>
          </div>
          {moveIn.status !== 'inventory_checked' && moveIn.status !== 'move_in_complete' && (
            <button 
              onClick={() => setActiveTab(nextAction.tab)}
              className="btn-primary text-sm"
            >
              Go to {nextAction.tab}
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card mb-8">
        <div className="flex items-center gap-2">
          {[
            { label: 'Initiated', icon: FileText },
            { label: 'Documents', icon: Upload },
            { label: 'Signed', icon: PenTool },
            { label: 'Inventory', icon: Package },
            { label: 'Complete', icon: CheckCircle },
          ].map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className={`flex flex-col items-center gap-1 flex-1 ${idx <= currentStep ? 'text-rose-600' : 'text-gray-300'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx <= currentStep ? 'bg-rose-100' : 'bg-gray-100'} ${idx === currentStep ? 'ring-2 ring-rose-500' : ''}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{step.label}</span>
              </div>
              {idx < 4 && (
                <div className={`flex-1 h-0.5 ${idx < currentStep ? 'bg-rose-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {['overview', 'documents', 'inventory'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold capitalize transition-colors ${
              activeTab === tab ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {tab === 'documents' && moveIn.documents?.length > 0 && (
              <span className="ml-1 badge badge-rose text-xs">{moveIn.documents.length}</span>
            )}
            {tab === 'inventory' && inventory.length > 0 && (
              <span className="ml-1 badge badge-rose text-xs">{inventory.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Property Details</h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500">Title:</span> {moveIn.property?.title}</p>
              <p><span className="text-gray-500">Address:</span> {moveIn.property?.address}, {moveIn.property?.city}</p>
              <p><span className="text-gray-500">Rent:</span> ${moveIn.property?.rent}/month</p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Current Status</h3>
            <div className="space-y-3">
              <StatusBadge status={moveIn.status} />
              <p className="text-sm text-gray-600 mt-2">{nextAction.text}</p>

              {moveIn.status === 'agreement_signed' && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mt-3">
                  <div className="flex items-center gap-2 text-amber-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Action Required</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Add all furniture, appliances, and fixtures to the inventory list. 
                    The landlord will verify them before approving your move-in.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Upload Form */}
          {moveIn.status === 'pending' && (
            <div className="card">
              <h3 className="font-semibold mb-4">Upload Document</h3>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Document Type</label>
                  <select className="input-field" value={docType} onChange={(e) => setDocType(e.target.value)}>
                    <option value="id_proof">ID Proof (Aadhar/PAN)</option>
                    <option value="address_proof">Address Proof</option>
                    <option value="income_proof">Income Proof</option>
                    <option value="employment_proof">Employment Letter</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">File</label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="input-field"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
              </form>
            </div>
          )}

          {/* Document Count Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Uploaded Documents ({moveIn.documents?.length || 0}/3)</h3>
              {moveIn.documents?.length >= 3 && (
                <span className="badge badge-green">Minimum reached</span>
              )}
            </div>

            {moveIn.documents?.length > 0 ? (
              <div className="space-y-3">
                {moveIn.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-rose-500" />
                      <div>
                        <p className="text-sm font-medium capitalize">{doc.type}</p>
                        <p className="text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-rose-600 text-sm hover:underline">
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No documents uploaded yet</p>
            )}
          </div>

          {/* Sign Agreement Button */}
          {moveIn.status === 'documents_uploaded' && (
            <div className="card bg-gradient-to-r from-emerald-50 to-white border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-emerald-800">Ready to Sign Agreement</h3>
                  <p className="text-sm text-gray-600">All required documents uploaded. Sign the rental agreement to proceed.</p>
                </div>
                <button onClick={handleSignAgreement} className="btn-primary bg-emerald-500 hover:bg-emerald-600">
                  Sign Agreement
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Add Item Form */}
          {moveIn.status === 'agreement_signed' && (
            <div className="card">
              <h3 className="font-semibold mb-4">Add Inventory Item</h3>
              <form onSubmit={handleAddInventory} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Item Name * (e.g. Sofa, Fridge)"
                    className="input-field"
                    value={inventoryForm.itemName}
                    onChange={(e) => setInventoryForm({...inventoryForm, itemName: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category (Furniture/Appliance/Electronic)"
                    className="input-field"
                    value={inventoryForm.category}
                    onChange={(e) => setInventoryForm({...inventoryForm, category: e.target.value})}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Condition * (New/Good/Fair/Damaged)"
                  className="input-field"
                  value={inventoryForm.preMoveInCondition}
                  onChange={(e) => setInventoryForm({...inventoryForm, preMoveInCondition: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Notes (optional details about item)"
                  className="input-field h-20 resize-none"
                  value={inventoryForm.notes}
                  onChange={(e) => setInventoryForm({...inventoryForm, notes: e.target.value})}
                />
                <button type="submit" className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </form>
            </div>
          )}

          {/* Inventory List */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Inventory Items ({inventory.length})</h3>
              {inventory.length > 0 && moveIn.status === 'agreement_signed' && (
                <p className="text-sm text-amber-600">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Add all items, then landlord will verify
                </p>
              )}
            </div>

            {inventory.length > 0 ? (
              <div className="space-y-3">
                {inventory.map((item) => (
                  <div key={item._id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{item.itemName}</h4>
                        <p className="text-sm text-gray-500">{item.category} · Condition: {item.condition}</p>
                        {item.notes && <p className="text-sm text-gray-600 mt-1">{item.notes}</p>}
                      </div>
                      <div className="flex gap-2">
                        {item.tenantVerified ? (
                          <span className="badge badge-green text-xs flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            You verified
                          </span>
                        ) : (
                          <button onClick={() => handleVerify(item._id)} className="btn-secondary text-xs">
                            Verify
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No inventory items yet</p>
                {moveIn.status === 'agreement_signed' && (
                  <p className="text-sm text-gray-400 mt-1">Add furniture, appliances, fixtures, etc.</p>
                )}
              </div>
            )}
          </div>

          {/* Waiting Message */}
          {moveIn.status === 'inventory_checked' && (
            <div className="card bg-gradient-to-r from-blue-50 to-white border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Inventory Verified</h3>
                  <p className="text-sm text-gray-600">Landlord has approved the inventory. Waiting for final move-in completion.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MoveInDetail